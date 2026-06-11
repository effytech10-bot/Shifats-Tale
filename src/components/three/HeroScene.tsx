"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FloatingBook from "./FloatingBook";
import FloatingCap from "./FloatingCap";
import FloatingShapes from "./FloatingShapes";

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-950/20">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] sm:h-[450px] md:h-[550px] relative">
      {/* Background glow behind 3D Canvas */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <Canvas
        shadows
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        className="w-full h-full select-none cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.6} />
        
        {/* Main Light casting shadows */}
        <directionalLight
          position={[5, 5, 2]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        
        {/* Key fill light */}
        <pointLight position={[-5, -5, -2]} intensity={0.4} />
        
        {/* Accent spotlight */}
        <spotLight
          position={[0, 4, 3]}
          angle={0.6}
          penumbra={0.5}
          intensity={1.5}
          color="#fbbf24"
        />

        <Suspense fallback={null}>
          <group position={[0, 0.1, 0]}>
            <FloatingBook />
            <FloatingCap />
            <FloatingShapes />
          </group>
        </Suspense>

        {/* Smooth OrbitControls without zooming/panning */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
