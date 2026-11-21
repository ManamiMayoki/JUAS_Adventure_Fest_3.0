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
      {/* Tree Trunk */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.25, 1.4, 5]} />
        <meshStandardMaterial color="#5C381E" roughness={0.8} />
      </mesh>
      {/* Cel-Shaded Foliage Layers */}
      <group ref={crownRef} position={[0, 1.4, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <coneGeometry args={[1.0, 1.25, 5]} />
          <meshStandardMaterial color="#196F3D" roughness={0.55} />
        </mesh>
        <mesh position={[0, 1.15, 0]} castShadow>
          <coneGeometry args={[0.78, 1.05, 5]} />
          <meshStandardMaterial color="#229954" roughness={0.55} />
        </mesh>
        <mesh position={[0, 1.8, 0]} castShadow>
          <coneGeometry args={[0.5, 0.85, 5]} />
          <meshStandardMaterial color="#27AE60" roughness={0.5} />
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
      waterRef.current.material.opacity = 0.82 + Math.sin(t * 1.5) * 0.05;
    }
    if (mistRef.current) {
      mistRef.current.rotation.y = t * 0.02;
    }
  });

  return (
    <group>
      {/* 1. Main Ground - Forest Grass Green */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[11, 12, 0.4, 20]} />
        <meshStandardMaterial color="#1E4D2B" roughness={0.8} />
      </mesh>

      {/* 2. JU Signature Terracotta Red-Brick Winding Trail */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[13, 1.5]} />
        <meshStandardMaterial color="#A93226" roughness={0.7} />
      </mesh>

      {/* Trail Amber Border Kerbs */}
      <mesh position={[0, 0.04, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13, 0.16]} />
        <meshStandardMaterial color="#F39C12" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.04, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13, 0.16]} />
        <meshStandardMaterial color="#F39C12" roughness={0.5} />
      </mesh>

      {/* 3. JU Lake Water */}
      <mesh position={[0, -0.15, 4.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.9, 24]} />
        <meshStandardMaterial color="#0B3C49" roughness={0.9} />
      </mesh>
      <mesh ref={waterRef} position={[0, -0.04, 4.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.8, 24]} />
        <meshStandardMaterial
          color="#00A8CC"
          roughness={0.12}
          metalness={0.25}
          transparent
          opacity={0.82}
        />
      </mesh>

      {/* 4. Lakeside Red-Brick Steps */}
      <mesh position={[0, 0.12, 1.8]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.26, 0.8]} />
        <meshStandardMaterial color="#A93226" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.01, 2.4]} receiveShadow>
        <boxGeometry args={[3.9, 0.22, 0.8]} />
        <meshStandardMaterial color="#922B21" roughness={0.7} />
      </mesh>

      {/* 5. Campus Forest Trees */}
      <LowPolyTree position={[-4.5, 0, -2.5]} scale={1.2} swayOffset={0} />
      <LowPolyTree position={[-3.2, 0, -3.8]} scale={0.9} swayOffset={1.2} />
      <LowPolyTree position={[-5.2, 0, 1.2]} scale={1.1} swayOffset={0.5} />
      <LowPolyTree position={[4.2, 0, -2.8]} scale={1.3} swayOffset={2.1} />
      <LowPolyTree position={[5.4, 0, -1.2]} scale={1.0} swayOffset={1.7} />
      <LowPolyTree position={[4.0, 0, 1.8]} scale={0.85} swayOffset={0.8} />

      {/* 6. Camping Tent (Sunset Magenta) */}
      <group position={[-3.8, 0, 3.2]} rotation={[0, 0.6, 0]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <coneGeometry args={[0.95, 1.2, 4]} />
          <meshStandardMaterial color="#D81B60" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.55, 0.48]}>
          <coneGeometry args={[0.32, 0.65, 3]} />
          <meshBasicMaterial color="#1E293B" />
        </mesh>
      </group>

      {/* 7. Lake Morning Mist Floating Particles */}
      <group ref={mistRef} position={[0, 0.65, 4]}>
        {[...Array(12)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin(i * 1.4) * 3.6,
              0.15 + Math.sin(i * 2.2) * 0.35,
              Math.cos(i * 1.4) * 2.4,
            ]}
          >
            <sphereGeometry args={[0.22, 6, 6]} />
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
