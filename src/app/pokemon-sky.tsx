"use client";

import { useEffect, useRef, useState } from "react";
import type * as Three from "three";

export default function PokemonSky() {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState("loading");
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef(false);
  useEffect(() => { pauseRef.current = paused; }, [paused]);
  useEffect(() => {
    const container = host.current!;
    let disposed = false, frame = 0;
    let renderer: Three.WebGLRenderer | undefined;
    let cleanup = () => {};
    const abort = new AbortController();
    async function start() {
      const [THREE, { createPokemon }] = await Promise.all([import("three"), import("./pokemon-model")]);
      if (disposed) return;
      const scene = new THREE.Scene();
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
      const camera = new THREE.PerspectiveCamera(34,1,0.1,500);
      camera.position.set(0,17,92);camera.lookAt(0,12,0);
      scene.add(new THREE.HemisphereLight(0xeaf6ff,0x605045,2));
      const sun = new THREE.DirectionalLight(0xfff4e6,2.3);sun.position.set(-30,60,70);scene.add(sun);
      const fill = new THREE.DirectionalLight(0xffb483,2);fill.position.set(40,25,-30);scene.add(fill);
      const loader = new THREE.TextureLoader();
      const entries = await Promise.all(["pikachu","eevee","charmander"].map(async name => {
        const response = await fetch(`/pokemon/${name}.json`, { signal: abort.signal });
        if (!response.ok) throw new Error("Model unavailable");
        const [data,texture] = await Promise.all([response.json(),loader.loadAsync(`/pokemon/${name}.png`)]);
        const model = createPokemon(data,texture);
        return {...model,name,texture,base:0};
      }));
      if(disposed) { entries.forEach(m=>{m.material.dispose();m.texture.dispose();m.root.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose();});});return; }
      entries.forEach((m,i) => {
        m.root.rotation.y = Math.PI + [-.17,.25,-.3][i];
        if(m.name === "eevee") { const right=m.bones.get("ear_right"),left=m.bones.get("ear_left"); if(right)right.rotation.z=-.95;if(left)left.rotation.z=.95; }
        if(m.name === "charmander") { const right=m.bones.get("arm_right"),left=m.bones.get("arm_left"); if(right)right.rotation.z=1.05;if(left)left.rotation.z=-1.05; }
        if(m.name === "pikachu") {
          const right=m.bones.get("arm_right"),left=m.bones.get("arm_left");
          if(right)right.rotation.z=.8;if(left)left.rotation.z=-.8;
          const er=m.bones.get("ear_right"),el=m.bones.get("ear_left");if(er)er.rotation.z=.25;if(el)el.rotation.z=-.3;
        }
        scene.add(m.root);
      });
      const resize = () => {
        const w=container.clientWidth,h=container.clientHeight;
        renderer!.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();
        const narrow=w<500;
        camera.position.z=Math.max(narrow ? 90 : 96, (narrow ? 29 : 35) / (Math.tan(THREE.MathUtils.degToRad(17)) * camera.aspect) + 10);
        const placements=narrow ? [[0,0,5,.85],[-16,0,2,.92],[16,0,2,.9]] : [[0,0,10,.97],[-18,0,5,1.1],[18,0,5,1.02]];
        entries.forEach((m,i)=>{const [x,y,z,s]=placements[i];m.root.position.set(x,y,z);m.root.scale.setScalar(s);m.base=y;});
      };
      const observer=new ResizeObserver(resize);observer.observe(container);resize();
      const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
      const pointer = new THREE.Vector2(0,0);
      const move=(event:PointerEvent)=>{const bounds=container.getBoundingClientRect();pointer.x=THREE.MathUtils.clamp((event.clientX-bounds.left)/bounds.width*2-1,-1,1);pointer.y=THREE.MathUtils.clamp(1-(event.clientY-bounds.top)/bounds.height*2,-1,1);};
      const reset=()=>pointer.set(0,0);
      window.addEventListener("pointermove",move,{passive:true});document.documentElement.addEventListener("pointerleave",reset);
      let visible=true;const intersection=new IntersectionObserver(([e])=>{visible=e.isIntersecting;});intersection.observe(container);
      const started=performance.now();
      const tick=()=>{
        if(disposed)return;
        frame=requestAnimationFrame(tick);
        const t=(performance.now()-started)/1000;
        if(!visible || document.hidden)return;
        const animate=!reduced.matches&&!pauseRef.current;
        entries.forEach((m,i)=>{
          if(m.head){const yaw=animate?pointer.x*.45:0,pitch=animate?pointer.y*.24:0;m.head.rotation.y=THREE.MathUtils.lerp(m.head.rotation.y,yaw,.07);m.head.rotation.x=THREE.MathUtils.lerp(m.head.rotation.x,pitch,.07);}
          m.root.position.y=m.base+(animate?Math.sin(t*.85+i*1.8)*.12:0);

        });
        renderer!.render(scene,camera);
      };
      cleanup=()=>{observer.disconnect();intersection.disconnect();window.removeEventListener("pointermove",move);document.documentElement.removeEventListener("pointerleave",reset);scene.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose();});entries.forEach(m=>{m.texture.dispose();m.material.dispose();});};
      setState("ready");tick();
    }
    start().catch(()=>{if(!disposed)setState("error");});
    return()=>{disposed=true;abort.abort();cancelAnimationFrame(frame);cleanup();renderer?.dispose();renderer?.domElement.remove();};
  },[]);
  return <div className="pokemon-stage"><div ref={host} className="pokemon-canvas" role="img" aria-label="Pikachu, Évoli et Salamèche en 3D côte à côte, leur tête suit votre souris"/>{state==="loading"&&<p className="scene-status" role="status">Les Pokémon arrivent…</p>}{state==="error"&&<p className="scene-status">La scène 3D n’a pas pu se charger. Essayez un navigateur compatible WebGL.</p>}{state==="ready"&&<><p className="scene-hint">Pikachu · Évoli · Salamèche<span>Déplacez votre souris, ils vous suivent du regard.</span></p><button className="motion-toggle" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?"Activer les animations":"Mettre en pause"}</button></>}</div>;
}




