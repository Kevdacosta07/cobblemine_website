import * as THREE from "three";

type Vec = [number, number, number];
type Cube = { origin: Vec; size: Vec; uv: [number, number]; inflate?: number; mirror?: boolean; pivot?: Vec; rotation?: Vec };
type Bone = { name: string; parent?: string; pivot: Vec; rotation?: Vec; cubes?: Cube[] };
export type Bedrock = { "minecraft:geometry": { description: { texture_width: number; texture_height: number }; bones: Bone[] }[] };

// Bedrock's box UV atlas is preserved face by face, including flat ear and eye planes.
export function createPokemon(data: Bedrock, texture: THREE.Texture) {
  const source = data["minecraft:geometry"][0];
  const { texture_width: tw, texture_height: th } = source.description;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  const material = new THREE.MeshStandardMaterial({ map: texture, transparent: false, alphaTest: 0.35, roughness: 1, metalness: 0, side: THREE.DoubleSide });
  const root = new THREE.Group();
  const bones = new Map<string, THREE.Group>();
  const definitions = new Map(source.bones.map(b => [b.name, b]));
  for (const bone of source.bones) { const group = new THREE.Group(); group.name = bone.name; bones.set(bone.name, group); }
  for (const bone of source.bones) {
    const group = bones.get(bone.name)!;
    const parent = bone.parent ? bones.get(bone.parent) : root;
    const parentPivot = bone.parent ? definitions.get(bone.parent)?.pivot ?? [0,0,0] : [0,0,0];
    group.position.set(bone.pivot[0]-parentPivot[0],bone.pivot[1]-parentPivot[1],bone.pivot[2]-parentPivot[2]);
    if (bone.rotation) group.rotation.set(...bone.rotation.map(value => -THREE.MathUtils.degToRad(value)) as Vec, "ZYX");
    (parent ?? root).add(group);
    if (/mouth_open|acting_teeth|eyelid|eyeshine.*2$/.test(bone.name)) group.visible = false;
    // Separate the eye decals from the head texture, preserving their relative layers.
    if (bone.name === "eyes") group.position.z -= 0.08;
    for (const cube of bone.cubes ?? []) {
      const [w,h,d] = cube.size, [u,v] = cube.uv;
      const inflation = cube.inflate ?? 0;
      const geometry = new THREE.BoxGeometry(Math.max(w+inflation*2,.008),Math.max(h+inflation*2,.008),Math.max(d+inflation*2,.008));
      const faces = [[u+d+w,v+d,d,h],[u,v+d,d,h],[u+d,v,w,d],[u+d+w,v,w,d],[u+2*d+w,v+d,w,h],[u+d,v+d,w,h]];
      const uv = geometry.getAttribute("uv");
      faces.forEach(([x,y,width,height],face) => {
        const left = (x+(cube.mirror ? width : 0))/tw;
        const right = (x+(cube.mirror ? 0 : width))/tw;
        const top = 1-y/th, bottom = 1-(y+height)/th;
        uv.setXY(face*4,left,top);uv.setXY(face*4+1,right,top);uv.setXY(face*4+2,left,bottom);uv.setXY(face*4+3,right,bottom);
      });
      // Bedrock flat cubes are single double-sided faces, not six overlapping box faces.
      const flatFace = d === 0 ? 5 : w === 0 ? 0 : h === 0 ? 2 : -1;
      if (flatFace >= 0) {
        const indices = geometry.index!;
        geometry.setIndex(Array.from({length: 6}, (_, i) => indices.getX(flatFace * 6 + i)));
        geometry.clearGroups();
      }
      const mesh = new THREE.Mesh(geometry,material);
      mesh.position.set(cube.origin[0]+w/2-bone.pivot[0],cube.origin[1]+h/2-bone.pivot[1],cube.origin[2]+d/2-bone.pivot[2]);
      if (cube.rotation && cube.pivot) {
        const pivot = new THREE.Group();pivot.position.set(cube.pivot[0]-bone.pivot[0],cube.pivot[1]-bone.pivot[1],cube.pivot[2]-bone.pivot[2]);
        mesh.position.set(cube.origin[0]+w/2-cube.pivot[0],cube.origin[1]+h/2-cube.pivot[1],cube.origin[2]+d/2-cube.pivot[2]);
        pivot.rotation.set(...cube.rotation.map(value => -THREE.MathUtils.degToRad(value)) as Vec,"ZYX");pivot.add(mesh);group.add(pivot);
      } else group.add(mesh);
    }
  }
  const head = bones.get("head_ai") ?? bones.get("head");
  return { root, bones, head, material };
}


