import {NextRequest} from 'next/server';
import {api,checkOrigin,failed,json,readBody,session} from '@/lib/auth-server';
const allowed=/^(me|grades|statistics|history|players(?:\/[0-9a-f-]{36}(?:\/actions)?)?)$/;
async function proxy(request:NextRequest,context:{params:Promise<{path:string[]}>},write:boolean){
 try{
  const route=(await context.params).path.join('/');
  if(!allowed.test(route)||write!==/^players\/[0-9a-f-]{36}\/actions$/.test(route))return json({message:'Page introuvable.'},404);
  if(write)checkOrigin(request);
  const token=await session();if(!token)return json({message:'Connectez-vous pour accéder au panel.'},401);
  const response=await api('/v1/admin/'+route+request.nextUrl.search,{session:token,method:write?'POST':'GET',body:write?await readBody(request):undefined,request});
  return json(await response.json(),response.status);
 }catch(error){return failed(error);}
}
export const GET=(r:NextRequest,c:{params:Promise<{path:string[]}>})=>proxy(r,c,false);
export const POST=(r:NextRequest,c:{params:Promise<{path:string[]}>})=>proxy(r,c,true);
