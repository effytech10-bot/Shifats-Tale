"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FloatingCap() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Hovering out of phase with the book
    groupRef.current.position.y = Math.cos(t * 1.0 + 1.5) * 0.15 - 0.4;
    // Slight sway
    groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.08 - 0.2;
    groupRef.current.rotation.y = -t * 0.15;
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group ref={groupRef} scale={[0.85, 0.85, 0.85]}>
      {/* Cap Skull Base (Cylinder under the board) */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.52, 0.35, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>

      {/* Cap Flat Board (Mortarboard top) */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.04, 1.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Cap Top Button */}
      <mesh position={[0, 0.035, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.03, 16]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.3} />
      </mesh>

      {/* Cap Tassel String & Hanging Part */}
      <group position={[0, 0.02, 0]}>
        {/* String lying across the board */}
        <mesh position={[0.4, 0.005, 0.4]} rotation={[0, -Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[0.7, 0.01, 0.02]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        {/* Hanging tassel detail */}
        <mesh position={[0.75, -0.2, 0.75]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.1} />
        </mesh>
      </group>
    </group>
  );
}
