"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import restPoses from "./exclusive-rest-poses.json";
import { createPokemon, type Bedrock } from "./pokemon-model";

export default function ExclusiveViewer({ species, shiny, name, interactive = true, onReady }: { species: string; shiny: boolean; name: string; interactive?: boolean; onReady?: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const ready = useRef(onReady);
  ready.current = onReady;
  const [status, setStatus] = useState("Chargement du modèle…");
  useEffect(() => {
    const container = host.current!;
    let disposed = false;
    let frame = 0;
    let renderer: THREE.WebGLRenderer | undefined;
    let observer: ResizeObserver | undefined;
    let root: THREE.Group | undefined;
    let texture: THREE.Texture | undefined;
    let material: THREE.Material | undefined;
    let cleanupPointer = () => {};
    const controller = new AbortController();
    setStatus("Chargement du modèle…");
    async function init() {
      try {
        const response = await fetch(`/exclusives/${species}.json`, { signal: controller.signal });
        if (!response.ok) throw new Error("Model unavailable");
        const data: Bedrock = await response.json();
        texture = await new THREE.TextureLoader().loadAsync(`/exclusives/${species}${shiny ? "-shiny" : ""}.png`);
        if (disposed) { texture.dispose(); return; }
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        const scene = new THREE.Scene();
        scene.add(new THREE.HemisphereLight(0xffffff, 0x8798b1, 2.5));
        const light = new THREE.DirectionalLight(0xfff3df, 3);
        light.position.set(-30, 50, 50); scene.add(light);
        const pokemon = createPokemon(data, texture);
        root = pokemon.root; material = pokemon.material;
        root.rotation.y = Math.PI - .3;
        // Ground-idle snapshot from Cobblemon; animation transforms are relative to the bind pose.
        const pose = (restPoses as Record<string, Record<string, { rotation?: number[]; position?: number[]; scale?: number[] }>>)[species];
        for (const [boneName, transform] of Object.entries(pose ?? {})) {
          const bone = pokemon.bones.get(boneName);
          if (!bone) continue;
          if (transform.rotation) bone.rotation.set(
            bone.rotation.x - THREE.MathUtils.degToRad(transform.rotation[0]),
            bone.rotation.y - THREE.MathUtils.degToRad(transform.rotation[1]),
            bone.rotation.z - THREE.MathUtils.degToRad(transform.rotation[2]), "ZYX");
          if (transform.position) bone.position.add(new THREE.Vector3(...transform.position));
          if (transform.scale) { bone.scale.set(...transform.scale as [number, number, number]); if (transform.scale.every(v => v === 0)) bone.visible = false; }
        }
        // Hide alternate facial expressions that are normally controlled by the game poser.
        for (const [boneName, bone] of pokemon.bones) {
          if (/mouth_open|eyelid|acting_teeth|eyeshine.*2$|^vines$/.test(boneName)) bone.visible = false;
        }
        root.updateMatrixWorld(true);
        const bounds = new THREE.Box3();
        root.traverseVisible(object => { if (object instanceof THREE.Mesh) bounds.expandByObject(object); });
        const center = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        root.position.sub(center);
        const pivot = new THREE.Group(); pivot.add(root); scene.add(pivot);
        const camera = new THREE.PerspectiveCamera(32, 1, .5, 1000);
        const resize = () => {
          if (!renderer || disposed) return;
          const width = container.clientWidth, height = container.clientHeight;
          renderer.setSize(width, height);
          camera.aspect = width / Math.max(height, 1);
          const radius = size.length() / 2;
          const halfFov = Math.min(THREE.MathUtils.degToRad(16), Math.atan(Math.tan(THREE.MathUtils.degToRad(16)) * camera.aspect));
          const distance = radius / Math.sin(halfFov) * 1.04;
          camera.zoom = species === "charizard" ? 1.22 : 1;
          camera.position.set(0, size.y * .045, distance);
          camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
          renderer.render(scene, camera);
        };
        const draw = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { if (!disposed) renderer?.render(scene, camera); }); };
        let activePointer: number | null = null, previousX = 0, previousY = 0;
        const rotate = (dx: number, dy: number) => {
          const delta = new THREE.Quaternion().setFromEuler(new THREE.Euler(dy * .009, dx * .009, 0, "XYZ"));
          pivot.quaternion.premultiply(delta).normalize(); draw();
        };
        const down = (event: PointerEvent) => {
          if (event.button !== 0 || activePointer !== null) return;
          activePointer = event.pointerId; previousX = event.clientX; previousY = event.clientY;
          container.setPointerCapture(event.pointerId); container.parentElement?.focus({ preventScroll: true });
        };
        const move = (event: PointerEvent) => {
          if (event.pointerId !== activePointer) return;
          rotate(event.clientX - previousX, event.clientY - previousY); previousX = event.clientX; previousY = event.clientY;
        };
        const up = (event: PointerEvent) => { if (event.pointerId === activePointer) { activePointer = null; if (container.hasPointerCapture(event.pointerId)) container.releasePointerCapture(event.pointerId); } };
        const reset = () => { pivot.quaternion.identity(); draw(); };
        const key = (event: KeyboardEvent) => {
          const directions: Record<string, [number, number]> = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] };
          if (directions[event.key]) { event.preventDefault(); rotate(...directions[event.key]); }
          if (event.key === "Home") { event.preventDefault(); reset(); }
        };
        if (interactive) {
          container.addEventListener("pointerdown", down); container.addEventListener("pointermove", move); container.addEventListener("pointerup", up); container.addEventListener("pointercancel", up); container.addEventListener("lostpointercapture", up); container.addEventListener("dblclick", reset); container.parentElement?.addEventListener("keydown", key);
          cleanupPointer = () => { container.removeEventListener("pointerdown", down); container.removeEventListener("pointermove", move); container.removeEventListener("pointerup", up); container.removeEventListener("pointercancel", up); container.removeEventListener("lostpointercapture", up); container.removeEventListener("dblclick", reset); container.parentElement?.removeEventListener("keydown", key); };
        }
        container.appendChild(renderer.domElement);
        observer = new ResizeObserver(resize); observer.observe(container); resize();
        setStatus("");
        ready.current?.();
      } catch { if (!disposed) { setStatus("L’aperçu 3D est indisponible sur ce navigateur."); ready.current?.(); } }
    }
    void init();
    return () => {
      disposed = true; controller.abort(); cancelAnimationFrame(frame); observer?.disconnect(); cleanupPointer();
      root?.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
      material?.dispose(); texture?.dispose(); renderer?.dispose(); renderer?.domElement.remove();
    };
  }, [species, shiny, interactive]);
  return <div className="exclusive-model" tabIndex={interactive ? 0 : undefined} role="img" aria-label={`${name} de Noël en 3D${shiny ? ", variante chromatique" : ""}. ${interactive ? "Faites glisser ou utilisez les quatre flèches pour tourner le modèle dans tous les sens. Double-clic ou touche Début pour recentrer." : ""}`}><div className="exclusive-canvas" ref={host} />{status && <p className="exclusive-loading" role="status">{status}</p>}</div>;
}
