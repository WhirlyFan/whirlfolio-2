import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { profile } from '@/content'
import { useStore } from '@/store/useStore'
import { PROFILE_ID } from '@/scene/constants'
import { getCircleTexture, getStarTexture } from '@/scene/textures'

const sunVertex = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// FBM over 3D simplex noise → an animated, turbulent sun surface.
const sunFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vPos;

  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p){
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++){
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main(){
    vec3 p = normalize(vPos);
    float t = uTime * 0.12;
    float n  = fbm(p * 2.4 + vec3(0.0, t, 0.0));
    float n2 = fbm(p * 5.5 - vec3(t * 0.6));
    float v = clamp((n * 0.6 + n2 * 0.4) * 0.5 + 0.5, 0.0, 1.0);

    vec3 cool = vec3(0.75, 0.18, 0.03); // deep ember
    vec3 mid  = vec3(1.0, 0.55, 0.12);  // orange
    vec3 hot  = vec3(1.0, 0.95, 0.72);  // near-white plasma
    vec3 col = mix(cool, mid, smoothstep(0.30, 0.62, v));
    col = mix(col, hot, smoothstep(0.62, 0.92, v));

    // Push brightness past 1.0 so the bloom pass catches it.
    col *= 1.5 + v * 0.9;
    gl_FragColor = vec4(col, 1.0);
  }
`

/**
 * The galactic core = Michael. An animated FBM-noise sun surface (turbulent,
 * glowing), with a corona and a clickable hit. Click opens the "about" panel.
 */
export function Core() {
  const meshRef = useRef<THREE.Mesh>(null)
  const raysRef = useRef<THREE.SpriteMaterial>(null)
  const select = useStore((s) => s.select)
  const reducedMotion = useStore((s) => s.reducedMotion)

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: sunVertex,
        fragmentShader: sunFragment,
        uniforms: { uTime: { value: 0 } },
        toneMapped: false,
      }),
    [],
  )

  useEffect(() => () => material.dispose(), [material])

  useFrame((state, delta) => {
    if (!reducedMotion) material.uniforms.uTime.value = state.clock.elapsedTime
    if (meshRef.current) {
      const t = reducedMotion ? 0 : state.clock.elapsedTime
      meshRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03)
    }
    if (raysRef.current && !reducedMotion) raysRef.current.rotation += delta * 0.05
  })

  return (
    <group>
      <pointLight position={[0, 0, 0]} intensity={40} distance={30} color="#ffd9a0" />

      <mesh
        ref={meshRef}
        material={material}
        onClick={(e) => {
          e.stopPropagation()
          select(PROFILE_ID)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[1.1, 64, 64]} />
      </mesh>

      {/* slowly-rotating corona rays (the spiked star texture, warm + faint) */}
      <sprite scale={[3.6, 3.6, 1]}>
        <spriteMaterial
          ref={raysRef}
          map={getStarTexture()}
          color="#ffb060"
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      {/* soft corona — a billboarded radial glow (no hard sphere-limb ring) */}
      <sprite scale={[6, 6, 1]}>
        <spriteMaterial
          map={getCircleTexture()}
          color="#ffb368"
          transparent
          opacity={0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      <Html position={[0, 1.95, 0]} center distanceFactor={14} pointerEvents="none">
        <div className="pointer-events-none select-none text-center whitespace-nowrap">
          <p className="text-base font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {profile.name}
          </p>
          <p className="text-[11px] text-white/70 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {profile.title}
          </p>
        </div>
      </Html>
    </group>
  )
}
