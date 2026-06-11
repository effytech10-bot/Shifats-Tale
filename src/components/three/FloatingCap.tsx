"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingCapProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  floatDelay?: number;
  floatSpeed?: number;
  floatIntensity?: number;
}

export default function FloatingCap({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  floatDelay = 0,
  floatSpeed = 1.0,
  floatIntensity = 0.15,
}: FloatingCapProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed + floatDelay;
    
    // Smooth floating motion (cos-based to be out of sync with books)
    groupRef.current.position.y = position[1] + Math.cos(t * 1.0 + 1.5) * floatIntensity;
    
    // Slow rotational sway
    groupRef.current.rotation.x = rotation[0] + Math.sin(t * 0.4) * 0.08;
    groupRef.current.rotation.y = rotation[1] - t * 0.12;
    groupRef.current.rotation.z = rotation[2] + Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Cap Skull Base (Cylinder under the board) */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.52, 0.35, 32]} />
        <meshStandardMaterial color="#0B1B4D" roughness={0.5} />
      </mesh>

      {/* Cap Flat Board (Mortarboard top) */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.04, 1.5]} />
        <meshStandardMaterial color="#010E62" roughness={0.4} />
      </mesh>

      {/* Cap Top Button */}
      <mesh position={[0, 0.035, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.03, 16]} />
        <meshStandardMaterial color="#FBB503" roughness={0.3} />
      </mesh>

      {/* Cap Tassel String & Hanging Part */}
      <group position={[0, 0.02, 0]}>
        {/* String lying across the board */}
        <mesh position={[0.4, 0.005, 0.4]} rotation={[0, -Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[0.7, 0.01, 0.02]} />
          <meshStandardMaterial color="#FBB503" />
        </mesh>
        {/* Hanging tassel detail */}
        <mesh position={[0.75, -0.2, 0.75]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
          <meshStandardMaterial color="#FBB503" emissive="#FBB503" emissiveIntensity={0.1} />
        </mesh>
      </group>
    </group>
  );
}

