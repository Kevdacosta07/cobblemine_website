"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createPokemon, type Bedrock } from "./pokemon-model";

export default function ExclusiveViewer({ species, shiny, name, interactive = true }: { species: string; shiny: boolean; name: string; interactive?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
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
        if (species === "pikachu") {
          const right = pokemon.bones.get("arm_right"), left = pokemon.bones.get("arm_left");
          if (right) right.rotation.z = .8;
          if (left) left.rotation.z = -.8;
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
          const distance = Math.max(size.y, size.x / camera.aspect) / (2 * Math.tan(THREE.MathUtils.degToRad(16))) * 1.18 + size.z / 2;
          camera.position.set(0, size.y * .045, distance);
          camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
          renderer.render(scene, camera);
        };
        const draw = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { if (!disposed) renderer?.render(scene, camera); }); };
        let dragging = false, previousX = 0;
        const down = (event: PointerEvent) => { dragging = true; previousX = event.clientX; container.setPointerCapture(event.pointerId); };
        const move = (event: PointerEvent) => { if (dragging) { pivot.rotation.y += (event.clientX - previousX) * .009; previousX = event.clientX; draw(); } };
        const up = () => { dragging = false; };
        const key = (event: KeyboardEvent) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); pivot.rotation.y += event.key === "ArrowLeft" ? -.2 : .2; draw(); } };
        container.addEventListener("pointerdown", down); container.addEventListener("pointermove", move); container.addEventListener("pointerup", up); container.addEventListener("pointercancel", up); container.parentElement?.addEventListener("keydown", key);
        cleanupPointer = () => { container.removeEventListener("pointerdown", down); container.removeEventListener("pointermove", move); container.removeEventListener("pointerup", up); container.removeEventListener("pointercancel", up); container.parentElement?.removeEventListener("keydown", key); };
        container.appendChild(renderer.domElement);
        observer = new ResizeObserver(resize); observer.observe(container); resize();
        setStatus("");
      } catch { if (!disposed) setStatus("L’aperçu 3D est indisponible sur ce navigateur."); }
    }
    void init();
    return () => {
      disposed = true; controller.abort(); cancelAnimationFrame(frame); observer?.disconnect(); cleanupPointer();
      root?.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
      material?.dispose(); texture?.dispose(); renderer?.dispose(); renderer?.domElement.remove();
    };
  }, [species, shiny]);
  return <div className="exclusive-model" tabIndex={interactive ? 0 : undefined} role="img" aria-label={`${name} de Noël en 3D${shiny ? ", variante chromatique" : ""}. ${interactive ? "Faites glisser ou utilisez les flèches gauche et droite pour tourner le modèle." : ""}`}><div className="exclusive-canvas" ref={host} />{status && <p className="exclusive-loading" role="status">{status}</p>}</div>;
}
