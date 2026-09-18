import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { isIP } from "node:net";
import { isAllowedOrigin } from "./origin-policy";

const secure = process.env.NODE_ENV === "production";
const cookieName = secure ? "__Host-cobblemine_session" : "cobblemine_session";
const apiBase = process.env.COBBLEMINE_API_URL || "https://api.cobblemine.com";
const origins = (process.env.SITE_ORIGINS || "https://cobblemine.com,https://cobblemine.fr").split(",").map(origin => origin.trim());

export class RequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {status, headers: {"Cache-Control":"no-store", "Vary":"Cookie"}});
}
export function checkOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin, request.headers.get("host"), origins, process.env.NODE_ENV === "development"))
    throw new RequestError(403,"Cette adresse n’est pas autorisée pour la connexion. Utilisez l’adresse habituelle du site.");
}
export async function readBody(request: NextRequest) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new RequestError(415,"Format de demande incorrect.");
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError(400,"Formulaire vide.");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const {done,value} = await reader.read(); if(done) break;
    size += value.length;
    if(size > 8192) { await reader.cancel(); throw new RequestError(413,"Formulaire trop volumineux."); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new RequestError(400,"Formulaire invalide."); }
}
export async function api(path: string, options: {method?: string; body?: unknown; session?: string; request?: NextRequest} = {}) {
  const method = options.method || "GET";
  const body = options.body === undefined ? undefined : JSON.stringify(options.body);
  const headers: Record<string,string> = body === undefined ? {} : {"Content-Type":"application/json"};
  if (options.session) headers.Authorization = `Bearer ${options.session}`;
  // Nginx overwrites X-Real-IP. The API accepts this IP only with our private signature.
  const ip = options.request?.headers.get("x-real-ip");
  if (process.env.WEB_PROXY_SECRET_FILE && ip && isIP(ip)) {
    const time = String(Date.now());
    const signature = createHmac("sha256",readFileSync(process.env.WEB_PROXY_SECRET_FILE,"utf8").trim())
      .update(`${time}\n${ip}\n${method}\n${path}`).digest("hex");
    headers["x-web-client-ip"] = ip; headers["x-web-time"] = time; headers["x-web-signature"] = signature;
  }
  return fetch(`${apiBase}${path}`,{method,body,headers,cache:"no-store",signal:AbortSignal.timeout(10000)});
}
export async function session() { return (await cookies()).get(cookieName)?.value; }
export async function setSession(value: string, expiresAt: string) {
  (await cookies()).set(cookieName,value,{httpOnly:true,secure,sameSite:"lax",path:"/",expires:new Date(expiresAt)});
}
export async function clearSession() {
  (await cookies()).set(cookieName,"",{httpOnly:true,secure,sameSite:"lax",path:"/",maxAge:0});
}
export function failed(error: unknown) {
  return json({message:error instanceof RequestError ? error.message : "Le service est momentanément indisponible. Réessayez dans un instant."},error instanceof RequestError ? error.status : 503);
}
