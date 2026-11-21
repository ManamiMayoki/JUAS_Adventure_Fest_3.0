import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FoxMascot = ({ position = [0, 0, 0] }) => {
  const groupRef = useRef();
  const tailRef = useRef();
  const headRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Patrol movement back and forth along the red-brick trail
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(t * 0.85) * 3.4;
      groupRef.current.position.z = Math.cos(t * 0.85) * 0.45;
      groupRef.current.rotation.y = Math.atan2(
        -Math.sin(t * 0.85) * 0.85 * 0.45,
        Math.cos(t * 0.85) * 0.85 * 3.4
      );
    }

    // Tail wagging
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 4.5) * 0.35 + 0.3;
    }

    // Head alert scanning
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.6) * 0.22;
    }

    // Leg running cycles
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(t * 6.5) * 0.45;
      rightLegRef.current.rotation.x = -Math.sin(t * 6.5) * 0.45;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[1.1, 1.1, 1.1]}>
      {/* 1. Fox Body - Radiant Golden Amber */}
      <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.65, 0.75, 0.72]} />
        <meshStandardMaterial
          color="#FF8C00"
          emissive="#FF7700"
          emissiveIntensity={0.2}
          roughness={0.3}
        />
      </mesh>

      {/* 2. White Chest Underbelly */}
      <mesh position={[0.22, 0.68, 0]}>
        <boxGeometry args={[0.92, 0.52, 0.74]} />
        <meshStandardMaterial color="#FFFBEB" roughness={0.4} />
      </mesh>

      {/* 3. Head Group */}
      <group ref={headRef} position={[1.0, 1.2, 0]}>
        {/* Head Block */}
        <mesh castShadow>
          <boxGeometry args={[0.72, 0.62, 0.62]} />
          <meshStandardMaterial
            color="#FF8C00"
            emissive="#FF7700"
            emissiveIntensity={0.2}
            roughness={0.3}
          />
        </mesh>
        {/* Snout */}
        <mesh position={[0.44, -0.1, 0]}>
          <boxGeometry args={[0.46, 0.32, 0.36]} />
          <meshStandardMaterial color="#FFFBEB" roughness={0.3} />
        </mesh>
        {/* Nose Tip */}
        <mesh position={[0.69, -0.05, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.12]} />
          <meshStandardMaterial color="#0F172A" roughness={0.2} />
        </mesh>
        {/* Left Ear */}
        <mesh position={[-0.1, 0.48, 0.23]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.19, 0.46, 4]} />
          <meshStandardMaterial color="#FF8C00" />
        </mesh>
        {/* Right Ear */}
        <mesh position={[-0.1, 0.48, -0.23]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.19, 0.46, 4]} />
          <meshStandardMaterial color="#FF8C00" />
        </mesh>
        {/* Glowing Luminous Eyes */}
        <mesh position={[0.32, 0.09, 0.29]}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshBasicMaterial color="#00FFFF" />
        </mesh>
        <mesh position={[0.32, 0.09, -0.29]}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshBasicMaterial color="#00FFFF" />
        </mesh>
      </group>

      {/* 4. Bushy Tail */}
      <group ref={tailRef} position={[-0.9, 0.95, 0]}>
        <mesh position={[-0.48, -0.2, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.34, 1.15, 6]} />
          <meshStandardMaterial
            color="#FF8C00"
            emissive="#FF7700"
            emissiveIntensity={0.2}
            roughness={0.4}
          />
        </mesh>
        {/* Tail White Tip */}
        <mesh position={[-0.9, -0.58, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.22, 0.48, 6]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
      </group>

      {/* 5. Legs */}
      <group ref={leftLegRef}>
        <mesh position={[0.55, 0.36, 0.33]} castShadow>
          <boxGeometry args={[0.22, 0.72, 0.22]} />
          <meshStandardMaterial color="#2E1C0C" roughness={0.5} />
        </mesh>
        <mesh position={[-0.55, 0.36, 0.33]} castShadow>
          <boxGeometry args={[0.22, 0.72, 0.22]} />
          <meshStandardMaterial color="#2E1C0C" roughness={0.5} />
        </mesh>
      </group>
      <group ref={rightLegRef}>
        <mesh position={[0.55, 0.36, -0.33]} castShadow>
          <boxGeometry args={[0.22, 0.72, 0.22]} />
          <meshStandardMaterial color="#2E1C0C" roughness={0.5} />
        </mesh>
        <mesh position={[-0.55, 0.36, -0.33]} castShadow>
          <boxGeometry args={[0.22, 0.72, 0.22]} />
          <meshStandardMaterial color="#2E1C0C" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};
