"use client";

import { useEffect, useRef, useState } from "react";
import type * as Three from "three";

function HeroScene() {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState("loading");
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
      const camera = new THREE.PerspectiveCamera(34,1,2,250);
      camera.position.set(0,20,74);camera.lookAt(0,20,0);
      scene.add(new THREE.HemisphereLight(0xeaf6ff,0x605045,2));
      const sun = new THREE.DirectionalLight(0xfff4e6,2.3);sun.position.set(-30,60,70);scene.add(sun);
      const fill = new THREE.DirectionalLight(0xffb483,2);fill.position.set(40,25,-30);scene.add(fill);
      const loader = new THREE.TextureLoader();
      const entries = await Promise.all(["pikachu"].map(async name => {
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
        if (!w || !h) return;
        renderer!.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();

        camera.position.z=Math.max(74, 20 / (Math.tan(THREE.MathUtils.degToRad(17)) * camera.aspect) + 8);
        const placements = [[0,0,0,1.4]];
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
        const animate=!reduced.matches;
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
    return()=>{disposed=true;abort.abort();cancelAnimationFrame(frame);cleanup();renderer?.dispose();renderer?.forceContextLoss();renderer?.domElement.remove();};
  },[]);
  return <><div ref={host} className="pokemon-canvas" role="img" aria-label="Pikachu en 3D, sa tête suit votre souris"/>{state==="loading"&&<p className="scene-status" role="status">Pikachu arrive…</p>}{state==="error"&&<p className="scene-status">La scène 3D n’a pas pu se charger. Essayez un navigateur compatible WebGL.</p>}</>;
}







// Free the hero GPU context while browsing lower sections. Rebuild it when returning.
export default function PokemonSky() {
  const stage = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "200px" });
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={stage} className="pokemon-stage">{visible && <HeroScene/>}</div>;
}
