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

    // Patrol movement back and forth along trail (X axis)
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(t * 0.8) * 3.5;
      groupRef.current.position.z = Math.cos(t * 0.8) * 1.2;
      groupRef.current.rotation.y = Math.atan2(
        -Math.sin(t * 0.8) * 0.8 * 1.2,
        Math.cos(t * 0.8) * 0.8 * 3.5
      );
    }

    // Tail wagging
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 4) * 0.35 + 0.3;
    }

    // Head alert scanning
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.2;
    }

    // Leg running cycles
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(t * 6) * 0.45;
      rightLegRef.current.rotation.x = -Math.sin(t * 6) * 0.45;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[0.85, 0.85, 0.85]}>
      {/* Fox Body */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1.6, 0.7, 0.7]} />
        <meshStandardMaterial color="#FF9E00" roughness={0.4} />
      </mesh>

      {/* White Chest Underbelly */}
      <mesh position={[0.2, 0.65, 0]}>
        <boxGeometry args={[0.9, 0.5, 0.72]} />
        <meshStandardMaterial color="#FFF8E7" roughness={0.5} />
      </mesh>

      {/* Head Group */}
      <group ref={headRef} position={[0.95, 1.15, 0]}>
        {/* Head Block */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.6, 0.6]} />
          <meshStandardMaterial color="#FF9E00" roughness={0.4} />
        </mesh>
        {/* Snout */}
        <mesh position={[0.42, -0.1, 0]}>
          <boxGeometry args={[0.45, 0.3, 0.35]} />
          <meshStandardMaterial color="#FFF8E7" roughness={0.4} />
        </mesh>
        {/* Nose Tip */}
        <mesh position={[0.66, -0.05, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.12]} />
          <meshStandardMaterial color="#111827" roughness={0.2} />
        </mesh>
        {/* Left Ear */}
        <mesh position={[-0.1, 0.45, 0.22]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.18, 0.45, 4]} />
          <meshStandardMaterial color="#FF9E00" />
        </mesh>
        {/* Right Ear */}
        <mesh position={[-0.1, 0.45, -0.22]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.18, 0.45, 4]} />
          <meshStandardMaterial color="#FF9E00" />
        </mesh>
        {/* Glowing Amber/Cyan Cyber-Fox Eyes */}
        <mesh position={[0.3, 0.08, 0.28]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#00E5FF" />
        </mesh>
        <mesh position={[0.3, 0.08, -0.28]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#00E5FF" />
        </mesh>
      </group>

      {/* Bushy Tail */}
      <group ref={tailRef} position={[-0.85, 0.9, 0]}>
        <mesh position={[-0.45, -0.2, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.32, 1.1, 6]} />
          <meshStandardMaterial color="#FF9E00" roughness={0.5} />
        </mesh>
        {/* Tail White Tip */}
        <mesh position={[-0.85, -0.55, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.2, 0.45, 6]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
        </mesh>
      </group>

      {/* Legs */}
      <group ref={leftLegRef}>
        <mesh position={[0.55, 0.35, 0.32]} castShadow>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color="#2A1B0E" roughness={0.6} />
        </mesh>
        <mesh position={[-0.55, 0.35, 0.32]} castShadow>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color="#2A1B0E" roughness={0.6} />
        </mesh>
      </group>
      <group ref={rightLegRef}>
        <mesh position={[0.55, 0.35, -0.32]} castShadow>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color="#2A1B0E" roughness={0.6} />
        </mesh>
        <mesh position={[-0.55, 0.35, -0.32]} castShadow>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color="#2A1B0E" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};
