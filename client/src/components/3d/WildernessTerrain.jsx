import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Low-poly Swaying Tree
const LowPolyTree = ({ position = [0, 0, 0], scale = 1, swayOffset = 0 }) => {
  const crownRef = useRef();

  useFrame(({ clock }) => {
    if (crownRef.current) {
      crownRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 1.5 + swayOffset) * 0.04;
      crownRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 1.2 + swayOffset) * 0.03;
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 1.4, 5]} />
        <meshStandardMaterial color="#4A2E18" roughness={0.8} />
      </mesh>
      {/* Foliage Layers */}
      <group ref={crownRef} position={[0, 1.4, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <coneGeometry args={[0.9, 1.2, 5]} />
          <meshStandardMaterial color="#15803D" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <coneGeometry args={[0.7, 1.0, 5]} />
          <meshStandardMaterial color="#16A34A" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.7, 0]} castShadow>
          <coneGeometry args={[0.45, 0.8, 5]} />
          <meshStandardMaterial color="#22C55E" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};

export const WildernessTerrain = () => {
  const waterRef = useRef();
  const mistRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (waterRef.current) {
      waterRef.current.material.opacity = 0.78 + Math.sin(t * 1.2) * 0.08;
    }
    if (mistRef.current) {
      mistRef.current.rotation.y = t * 0.02;
    }
  });

  return (
    <group>
      {/* Main Ground - Grassy Wilderness */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[11, 12, 0.4, 16]} />
        <meshStandardMaterial color="#0F1F17" roughness={0.9} />
      </mesh>

      {/* JU Signature Red-Brick Winding Trail */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[13, 1.4]} />
        <meshStandardMaterial color="#991B1B" roughness={0.8} />
      </mesh>
      {/* Trail border kerbs */}
      <mesh position={[0, 0.04, 0.75]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13, 0.15]} />
        <meshStandardMaterial color="#FF9E00" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.04, -0.75]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13, 0.15]} />
        <meshStandardMaterial color="#FF9E00" roughness={0.5} />
      </mesh>

      {/* JU Tranquil Lake Water */}
      <mesh ref={waterRef} position={[0, -0.05, 4.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.8, 24]} />
        <meshStandardMaterial
          color="#00E5FF"
          roughness={0.1}
          metalness={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Lakeside Red-Brick Ghat / Steps */}
      <mesh position={[0, 0.1, 1.8]}>
        <boxGeometry args={[3.5, 0.25, 0.8]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.02, 2.4]}>
        <boxGeometry args={[3.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#991B1B" roughness={0.7} />
      </mesh>

      {/* Campus Forest Trees */}
      <LowPolyTree position={[-4.5, 0, -2.5]} scale={1.2} swayOffset={0} />
      <LowPolyTree position={[-3.2, 0, -3.8]} scale={0.9} swayOffset={1.2} />
      <LowPolyTree position={[-5.2, 0, 1.2]} scale={1.1} swayOffset={0.5} />
      <LowPolyTree position={[4.2, 0, -2.8]} scale={1.3} swayOffset={2.1} />
      <LowPolyTree position={[5.4, 0, -1.2]} scale={1.0} swayOffset={1.7} />
      <LowPolyTree position={[4.0, 0, 1.8]} scale={0.85} swayOffset={0.8} />

      {/* Camping Tent (Bushcraft Zone indicator) */}
      <group position={[-3.8, 0, 3.2]} rotation={[0, 0.6, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <coneGeometry args={[0.9, 1.1, 4]} />
          <meshStandardMaterial color="#FF2A85" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.5, 0.45]}>
          <coneGeometry args={[0.3, 0.6, 3]} />
          <meshBasicMaterial color="#0B0F19" />
        </mesh>
      </group>

      {/* Lake Morning Mist Floating Particles */}
      <group ref={mistRef} position={[0, 0.6, 4]}>
        {[...Array(12)].map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.sin(i * 1.5) * 3.5),
              Math.sin(i * 2) * 0.3,
              (Math.cos(i * 1.5) * 2.2),
            ]}
          >
            <sphereGeometry args={[0.25, 6, 6]} />
            <meshStandardMaterial
              color="#00E5FF"
              transparent
              opacity={0.18}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
