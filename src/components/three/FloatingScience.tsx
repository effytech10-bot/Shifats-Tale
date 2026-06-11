"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ScienceProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  floatDelay?: number;
  floatSpeed?: number;
  floatIntensity?: number;
}

// 1. Physics: Floating Atom Model
export function FloatingAtom({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  floatDelay = 0,
  floatSpeed = 1.0,
  floatIntensity = 0.15,
}: ScienceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const electron1Ref = useRef<THREE.Mesh>(null);
  const electron2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed + floatDelay;

    // Slow floating translation
    groupRef.current.position.y = position[1] + Math.cos(t * 1.0 + 1.5) * floatIntensity;

    // Slow overall rotational sway
    groupRef.current.rotation.x = rotation[0] + Math.sin(t * 0.4) * 0.08;
    groupRef.current.rotation.y = rotation[1] - t * 0.12;
    groupRef.current.rotation.z = rotation[2] + Math.sin(t * 0.3) * 0.05;

    // Animate electrons along orbits
    const orbitalTime1 = t * 3.5;
    if (electron1Ref.current) {
      electron1Ref.current.position.x = Math.cos(orbitalTime1) * 0.55;
      electron1Ref.current.position.y = Math.sin(orbitalTime1) * 0.55;
    }

    const orbitalTime2 = t * 2.8;
    if (electron2Ref.current) {
      electron2Ref.current.position.x = Math.cos(orbitalTime2) * 0.55;
      electron2Ref.current.position.z = Math.sin(orbitalTime2) * 0.55;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Central Nucleus (Cluster of overlapping protons & neutrons) */}
      <group>
        {/* Central Protons (Deep Navy) */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial color="#010E62" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0.07, 0.05, 0.04]} castShadow>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial color="#0B1B4D" roughness={0.3} />
        </mesh>
        {/* Central Neutrons (Gold Accent) */}
        <mesh position={[-0.07, -0.05, 0.05]} castShadow>
          <sphereGeometry args={[0.14, 24, 24]} />
          <meshStandardMaterial color="#FBB503" roughness={0.1} metalness={0.7} />
        </mesh>
        <mesh position={[0.04, -0.07, -0.06]} castShadow>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial color="#FBB503" roughness={0.1} metalness={0.7} />
        </mesh>
      </group>

      {/* Orbit 1 (Tilted Ring) */}
      <group rotation={[Math.PI / 6, Math.PI / 4, 0]}>
        <mesh>
          <torusGeometry args={[0.55, 0.012, 8, 64]} />
          <meshStandardMaterial color="#E7E0D2" opacity={0.6} transparent />
        </mesh>
        {/* Electron 1 */}
        <mesh ref={electron1Ref} position={[0.55, 0, 0]} castShadow>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#FBB503" emissive="#FBB503" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Orbit 2 (Tilted Opposite) */}
      <group rotation={[-Math.PI / 6, -Math.PI / 4, Math.PI / 2]}>
        <mesh>
          <torusGeometry args={[0.55, 0.012, 8, 64]} />
          <meshStandardMaterial color="#E7E0D2" opacity={0.6} transparent />
        </mesh>
        {/* Electron 2 */}
        <mesh ref={electron2Ref} position={[0.55, 0, 0]} castShadow>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#FBB503" emissive="#FBB503" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// 2. Chemistry: Molecular Bond Structure
export function FloatingMolecule({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  floatDelay = 0,
  floatSpeed = 1.0,
  floatIntensity = 0.15,
}: ScienceProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed + floatDelay;

    // Slow floating translation
    groupRef.current.position.y = position[1] + Math.sin(t * 0.9 + 0.8) * floatIntensity;

    // Spinning / tumbling rotation
    groupRef.current.rotation.x = rotation[0] + t * 0.15;
    groupRef.current.rotation.y = rotation[1] + t * 0.1;
    groupRef.current.rotation.z = rotation[2] + Math.cos(t * 0.3) * 0.05;
  });

  // Molecular offsets (Tetrahedral bonds)
  const atoms = [
    { pos: [0, 0, 0], color: "#010E62", size: 0.18 }, // Central Core Atom
    { pos: [0.42, 0.42, 0.42], color: "#FBB503", size: 0.1 }, // Gold Satellite 1
    { pos: [-0.42, -0.42, 0.42], color: "#FBB503", size: 0.1 }, // Gold Satellite 2
    { pos: [-0.42, 0.42, -0.42], color: "#FBB503", size: 0.1 }, // Gold Satellite 3
    { pos: [0.42, -0.42, -0.42], color: "#FBB503", size: 0.1 }, // Gold Satellite 4
  ];

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Central Core & Satellite Atoms */}
      {atoms.map((atom, index) => (
        <mesh key={index} position={atom.pos as [number, number, number]} castShadow>
          <sphereGeometry args={[atom.size, 32, 32]} />
          <meshStandardMaterial
            color={atom.color}
            roughness={0.15}
            metalness={atom.color === "#FBB503" ? 0.8 : 0.4}
          />
        </mesh>
      ))}

      {/* Intermolecular Bond Connectors */}
      {/* Connector 1 */}
      <group rotation={[0.6, 0.8, 0]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.44, 8]} />
          <meshStandardMaterial color="#E7E0D2" roughness={0.3} />
        </mesh>
      </group>
      {/* Connector 2 */}
      <group rotation={[-0.6, -0.8, 0]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.44, 8]} />
          <meshStandardMaterial color="#E7E0D2" roughness={0.3} />
        </mesh>
      </group>
      {/* Connector 3 */}
      <group rotation={[-0.6, 0.8, 0.6]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.44, 8]} />
          <meshStandardMaterial color="#E7E0D2" roughness={0.3} />
        </mesh>
      </group>
      {/* Connector 4 */}
      <group rotation={[0.6, -0.8, -0.6]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.44, 8]} />
          <meshStandardMaterial color="#E7E0D2" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// 3. Mathematics: Polyhedron & Coordinate Axes
export function FloatingMath({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  floatDelay = 0,
  floatSpeed = 1.0,
  floatIntensity = 0.15,
}: ScienceProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed + floatDelay;

    // Slow floating translation
    groupRef.current.position.y = position[1] + Math.cos(t * 0.8 - 0.5) * floatIntensity;

    // Tumbling mathematical rotation
    groupRef.current.rotation.x = rotation[0] + Math.sin(t * 0.35) * 0.08;
    groupRef.current.rotation.y = rotation[1] + t * 0.08;
    groupRef.current.rotation.z = rotation[2] + Math.cos(t * 0.25) * 0.05;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Mathematical Wireframe Icosahedron */}
      <mesh castShadow>
        <icosahedronGeometry args={[0.36, 0]} />
        <meshStandardMaterial
          color="#0B1B4D"
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.37, 0]} />
        <meshStandardMaterial
          color="#FBB503"
          wireframe
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* X, Y, Z Coordinate Axis lines intersecting the center */}
      <group position={[0, 0, 0]}>
        {/* X Axis (Navy) */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.9, 8]} />
          <meshStandardMaterial color="#010E62" roughness={0.5} opacity={0.7} transparent />
        </mesh>
        {/* Y Axis (Gold) */}
        <mesh rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.9, 8]} />
          <meshStandardMaterial color="#FBB503" roughness={0.5} opacity={0.7} transparent />
        </mesh>
        {/* Z Axis (Cream) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.9, 8]} />
          <meshStandardMaterial color="#E7E0D2" roughness={0.5} opacity={0.7} transparent />
        </mesh>
      </group>
    </group>
  );
}

// 4. Mathematics: Möbius Strip (Twisted Mathematical Ribbon)
export function FloatingMobius({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  floatDelay = 0,
  floatSpeed = 1.0,
  floatIntensity = 0.15,
}: ScienceProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed + floatDelay;

    // Slow floating translation
    groupRef.current.position.y = position[1] + Math.sin(t * 0.85 + 1.2) * floatIntensity;

    // Slow rotation / tumbling to showcase the twist
    groupRef.current.rotation.x = rotation[0] + t * 0.15;
    groupRef.current.rotation.y = rotation[1] + t * 0.22;
    groupRef.current.rotation.z = rotation[2] + Math.cos(t * 0.3) * 0.06;
  });

  // Mathematically generate Möbius Strip geometry
  const geom = React.useMemo(() => {
    const g = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    const uSegments = 50;
    const vSegments = 8;
    
    for (let j = 0; j <= vSegments; j++) {
      const v = -0.12 + (j / vSegments) * 0.24; // width from -0.12 to 0.12
      for (let i = 0; i <= uSegments; i++) {
        const u = (i / uSegments) * Math.PI * 2;
        const a = 0.35; // major radius
        
        // Parametric formulas for Möbius strip
        const x = (a + v * Math.cos(u / 2)) * Math.cos(u);
        const y = (a + v * Math.cos(u / 2)) * Math.sin(u);
        const z = v * Math.sin(u / 2);
        
        vertices.push(x, y, z);
      }
    }
    
    for (let j = 0; j < vSegments; j++) {
      for (let i = 0; i < uSegments; i++) {
        const row1 = j * (uSegments + 1);
        const row2 = (j + 1) * (uSegments + 1);
        
        const a = row1 + i;
        const b = row1 + i + 1;
        const c = row2 + i;
        const d = row2 + i + 1;
        
        // Face 1 (front side)
        indices.push(a, b, c);
        indices.push(b, d, c);
        
        // Face 2 (back side for double-sided rendering support)
        indices.push(c, b, a);
        indices.push(c, d, b);
      }
    }
    
    g.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Solid Navy twisted band */}
      <mesh geometry={geom} castShadow receiveShadow>
        <meshStandardMaterial 
          color="#0B1B4D" 
          roughness={0.25} 
          metalness={0.3} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      
      {/* Wireframe Gold overlay band to emphasize mathematics */}
      <mesh geometry={geom} scale={[1.01, 1.01, 1.01]}>
        <meshStandardMaterial 
          color="#FBB503" 
          wireframe 
          roughness={0.1} 
          metalness={0.9} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
}

// 5. Physics: Light Prism Refraction (Spectrum)
export function FloatingPrism({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  floatDelay = 0,
  floatSpeed = 1.0,
  floatIntensity = 0.15,
}: ScienceProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed + floatDelay;

    // Slow floating translation
    groupRef.current.position.y = position[1] + Math.cos(t * 0.95 - 0.7) * floatIntensity;

    // Slow tumbling rotation to capture light angles
    groupRef.current.rotation.x = rotation[0] + Math.sin(t * 0.3) * 0.08;
    groupRef.current.rotation.y = rotation[1] + t * 0.12;
    groupRef.current.rotation.z = rotation[2] + Math.cos(t * 0.2) * 0.06;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Glass Triangular Prism (3 radial segments creates a triangle) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 3]} />
        <meshStandardMaterial 
          color="#E7E0D2" 
          roughness={0.1} 
          metalness={0.1} 
          transparent 
          opacity={0.5} 
        />
      </mesh>

      {/* Wireframe border highlights for the prism */}
      <mesh>
        <cylinderGeometry args={[0.222, 0.222, 0.505, 3]} />
        <meshStandardMaterial 
          color="#E7E0D2" 
          wireframe 
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Incoming White Light Ray */}
      <group position={[-0.32, -0.15, 0]} rotation={[0, 0, Math.PI / 6]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.38, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Exiting Spectrum Fan (Rainbow) */}
      <group position={[0.1, 0, 0]}>
        {/* Red Ray */}
        <group position={[0.16, 0.04, 0]} rotation={[0, 0, -Math.PI / 12]}>
          <mesh>
            <cylinderGeometry args={[0.006, 0.006, 0.38, 8]} />
            <meshBasicMaterial color="#FF3B30" />
          </mesh>
        </group>
        {/* Yellow Ray */}
        <group position={[0.16, 0.01, 0]} rotation={[0, 0, -Math.PI / 24]}>
          <mesh>
            <cylinderGeometry args={[0.006, 0.006, 0.38, 8]} />
            <meshBasicMaterial color="#FFCC00" />
          </mesh>
        </group>
        {/* Green Ray */}
        <group position={[0.16, -0.02, 0]} rotation={[0, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.006, 0.006, 0.38, 8]} />
            <meshBasicMaterial color="#34C759" />
          </mesh>
        </group>
        {/* Blue Ray */}
        <group position={[0.16, -0.05, 0]} rotation={[0, 0, Math.PI / 24]}>
          <mesh>
            <cylinderGeometry args={[0.006, 0.006, 0.38, 8]} />
            <meshBasicMaterial color="#007AFF" />
          </mesh>
        </group>
        {/* Violet Ray */}
        <group position={[0.16, -0.08, 0]} rotation={[0, 0, Math.PI / 12]}>
          <mesh>
            <cylinderGeometry args={[0.006, 0.006, 0.38, 8]} />
            <meshBasicMaterial color="#AF52DE" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
