"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FloatingBook() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Hovering motion
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.15 + 0.3;
    // Rotation motion
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    groupRef.current.rotation.y = t * 0.25;
    groupRef.current.rotation.z = Math.cos(t * 0.3) * 0.05;
  });

  return (
    <group ref={groupRef} scale={[1.1, 1.1, 1.1]}>
      {/* Book Cover (Navy Blue / Purple) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.15, 2.0]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Book Pages (Cream White, slightly smaller than cover) */}
      <mesh position={[0, 0, 0.05]} castShadow>
        <boxGeometry args={[1.4, 0.12, 1.9]} />
        <meshStandardMaterial color="#fef08a" roughness={0.8} />
      </mesh>

      {/* Gold Ribbon/Bookmark marker */}
      <mesh position={[0, -0.02, 1.0]} castShadow>
        <boxGeometry args={[0.15, 0.01, 0.3]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}
