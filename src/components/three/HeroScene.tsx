"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import FloatingBook from "./FloatingBook";
import FloatingCap from "./FloatingCap";
import FloatingShapes from "./FloatingShapes";
import * as THREE from "three";

// Reusable Background Particles (slow glowing dots)
function BackgroundParticles({ count = 40, speedScale = 1.0 }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const tempPositions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread particles in a box around the center
      arr[i * 3] = (Math.random() - 0.5) * 8; // x
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8; // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1; // z
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime() * speedScale;
    pointsRef.current.rotation.y = t * 0.04;
    pointsRef.current.rotation.x = Math.sin(t * 0.02) * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[tempPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FBB503" // Gold Accent
        size={0.045}
        sizeAttenuation={true}
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[350px] sm:min-h-[450px] md:min-h-[550px] flex items-center justify-center bg-transparent">
        {/* Subtle loading placeholder */}
        <div className="w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  // Animation intensity/speed modifiers based on system accessibility settings
  const speed = reduceMotion ? 0.05 : 1.0;
  const intensity = reduceMotion ? 0.1 : 1.0;

  return (
    <div className="w-full h-[350px] sm:h-[450px] md:h-[550px] relative pointer-events-none select-none">
      {/* Background glow behind 3D Canvas */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/3 to-accent/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="w-full h-full bg-transparent"
        gl={{ alpha: true, antialias: true }}
      >
        {/* Academic branding colors lighting */}
        <ambientLight intensity={0.8} />
        
        {/* Main Light casting shadows */}
        <directionalLight
          position={[5, 8, 3]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        
        {/* Fill light */}
        <pointLight position={[-6, -6, -2]} intensity={0.5} />
        
        {/* Accent gold spotlight */}
        <spotLight
          position={[0, 6, 2]}
          angle={0.8}
          penumbra={0.8}
          intensity={1.8}
          color="#FBB503"
        />

        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            {/* 1 Central Floating Graduation Cap */}
            <FloatingCap 
              position={[0, 0.5, 0]} 
              scale={[0.7, 0.7, 0.7]} 
              floatSpeed={0.8 * speed}
              floatIntensity={0.12 * intensity}
            />

            {/* 3 Floating Books in different configurations */}
            {/* Book 1: Large Navy Book left */}
            <FloatingBook 
              position={[-1.4, 0.3, -0.4]} 
              rotation={[0.2, 0.4, -0.2]}
              scale={[0.7, 0.7, 0.7]}
              coverColor="#010E62" // Deep Navy
              floatDelay={0}
              floatSpeed={0.9 * speed}
              floatIntensity={0.15 * intensity}
            />

            {/* Book 2: Medium Oxford Blue Book right */}
            <FloatingBook 
              position={[1.5, -0.2, 0.3]} 
              rotation={[-0.3, -0.5, 0.1]}
              scale={[0.62, 0.62, 0.62]}
              coverColor="#0B1B4D" // Oxford Blue
              floatDelay={2.5}
              floatSpeed={0.7 * speed}
              floatIntensity={0.13 * intensity}
            />

            {/* Book 3: Small Gold Book bottom center-left */}
            <FloatingBook 
              position={[-0.4, -0.9, 0.6]} 
              rotation={[0.4, -0.2, 0.3]}
              scale={[0.5, 0.5, 0.5]}
              coverColor="#FBB503" // Gold Accent
              floatDelay={5.0}
              floatSpeed={0.8 * speed}
              floatIntensity={0.1 * intensity}
            />

            {/* Abstract gold/navy rings and boxes floating around */}
            <FloatingShapes />
            
            {/* Background glowing gold particles */}
            <BackgroundParticles count={50} speedScale={0.8 * speed} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}

