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
      shape1Ref.current.position.y = Math.sin(t * 0.8) * 0.2 + 0.9;
      shape1Ref.current.rotation.x = t * 0.3;
      shape1Ref.current.rotation.y = t * 0.2;
    }

    if (shape2Ref.current) {
      shape2Ref.current.position.y = Math.cos(t * 0.6) * 0.15 - 0.9;
      shape2Ref.current.rotation.z = -t * 0.4;
      shape2Ref.current.rotation.x = t * 0.15;
    }

    if (shape3Ref.current) {
      shape3Ref.current.position.y = Math.sin(t * 1.1) * 0.1 - 0.1;
      shape3Ref.current.position.x = Math.cos(t * 0.5) * 0.1 - 1.2;
    }
  });

  return (
    <group>
      {/* Golden Torus Ring (Top Right) */}
      <mesh ref={shape1Ref} position={[1.4, 0.9, -0.5]} castShadow>
        <torusGeometry args={[0.3, 0.08, 16, 100]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Teal Blue Cone (Bottom Left) */}
      <mesh ref={shape2Ref} position={[-1.3, -0.9, -0.3]} castShadow>
        <coneGeometry args={[0.25, 0.5, 4]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Small Glowing Teal Sphere (Middle Left-ish) */}
      <mesh ref={shape3Ref} position={[-1.2, -0.1, 0.4]} castShadow>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>
    </group>
  );
}
