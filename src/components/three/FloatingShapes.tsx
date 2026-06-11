"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FloatingShapes() {
  const shape1Ref = useRef<THREE.Mesh>(null);
  const shape2Ref = useRef<THREE.Mesh>(null);
  const shape3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (shape1Ref.current) {
      shape1Ref.current.position.y = Math.sin(t * 0.8) * 0.15 + 0.8;
      shape1Ref.current.rotation.x = t * 0.2;
      shape1Ref.current.rotation.y = t * 0.15;
    }

    if (shape2Ref.current) {
      shape2Ref.current.position.y = Math.cos(t * 0.6) * 0.15 - 0.8;
      shape2Ref.current.rotation.z = -t * 0.25;
      shape2Ref.current.rotation.x = t * 0.1;
    }

    if (shape3Ref.current) {
      shape3Ref.current.position.y = Math.sin(t * 1.0) * 0.08 - 0.1;
      shape3Ref.current.position.x = Math.cos(t * 0.4) * 0.08 - 1.2;
    }
  });

  return (
    <group>
      {/* Gold Torus Ring (Top Right) */}
      <mesh ref={shape1Ref} position={[1.4, 0.8, -0.5]} castShadow>
        <torusGeometry args={[0.25, 0.06, 16, 100]} />
        <meshStandardMaterial color="#FBB503" roughness={0.15} metalness={0.9} />
      </mesh>

      {/* Deep Navy Octahedron / Cone (Bottom Left) */}
      <mesh ref={shape2Ref} position={[-1.3, -0.8, -0.3]} castShadow>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial color="#0B1B4D" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Small Glowing Gold/Cream Sphere (Middle Left-ish) */}
      <mesh ref={shape3Ref} position={[-1.2, -0.1, 0.4]} castShadow>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#FBB503" emissive="#FBB503" emissiveIntensity={0.3} roughness={0.1} />
      </mesh>
    </group>
  );
}

