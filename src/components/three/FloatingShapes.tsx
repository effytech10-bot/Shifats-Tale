"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FloatingShapes() {
  const shape2Ref = useRef<THREE.Mesh>(null);
  const shape3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (shape2Ref.current) {
      // Float around JSX y = 0.0 (Middle Left)
      shape2Ref.current.position.y = Math.cos(t * 0.6) * 0.15 + 0.0;
      shape2Ref.current.rotation.z = -t * 0.25;
      shape2Ref.current.rotation.x = t * 0.1;
    }

    if (shape3Ref.current) {
      // Float around JSX y = 0.9, x = -0.7 (Top Left-ish)
      shape3Ref.current.position.y = Math.sin(t * 1.0) * 0.08 + 0.9;
      shape3Ref.current.position.x = Math.cos(t * 0.4) * 0.08 - 0.7;
    }
  });

  return (
    <group>
      {/* Deep Navy Octahedron / Cone (Middle Left, Far Back) */}
      <mesh ref={shape2Ref} position={[-1.5, 0.0, -0.5]} castShadow>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#0B1B4D" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Small Glowing Gold/Cream Sphere (Top Left-ish, Far Back) */}
      <mesh ref={shape3Ref} position={[-0.7, 0.9, -0.7]} castShadow>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#FBB503" emissive="#FBB503" emissiveIntensity={0.3} roughness={0.1} />
      </mesh>
    </group>
  );
}

