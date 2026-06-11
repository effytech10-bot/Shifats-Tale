"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingBookProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  coverColor?: string;
  floatDelay?: number;
  floatSpeed?: number;
  floatIntensity?: number;
}

export default function FloatingBook({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  coverColor = "#010E62", // Deep Navy
  floatDelay = 0,
  floatSpeed = 1.0,
  floatIntensity = 0.15,
}: FloatingBookProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed + floatDelay;
    
    // Smooth floating motion
    groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * floatIntensity;
    
    // Slow rotational sway
    groupRef.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.08;
    groupRef.current.rotation.y = rotation[1] + t * 0.15;
    groupRef.current.rotation.z = rotation[2] + Math.cos(t * 0.3) * 0.05;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Book Cover */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.14, 2.0]} />
        <meshStandardMaterial color={coverColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Book Pages (Soft Cream) */}
      <mesh position={[0, 0, 0.04]} castShadow>
        <boxGeometry args={[1.42, 0.11, 1.92]} />
        <meshStandardMaterial color="#FFFCF2" roughness={0.8} />
      </mesh>

      {/* Gold Ribbon/Bookmark marker */}
      <mesh position={[0, -0.02, 1.0]} castShadow>
        <boxGeometry args={[0.15, 0.015, 0.3]} />
        <meshStandardMaterial color="#FBB503" emissive="#FBB503" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
}

