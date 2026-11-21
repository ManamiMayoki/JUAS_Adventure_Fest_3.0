import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Single Migratory Bird with flapping wings
const Bird = ({ offset = 0, speed = 1, baseAltitude = 4.5, radius = 7 }) => {
  const birdRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;

    if (birdRef.current) {
      // Dynamic V-formation flight path across the lake
      const x = Math.sin(t * 0.4) * radius;
      const z = Math.cos(t * 0.4) * (radius * 0.7);
      const y = baseAltitude + Math.sin(t * 1.2) * 0.6;

      birdRef.current.position.set(x, y, z);

      // Smooth banking into turns
      const heading = t * 0.4 + Math.PI / 2;
      birdRef.current.rotation.y = heading;
      birdRef.current.rotation.z = Math.sin(t * 0.4) * 0.25;
    }

    // Wing flapping
    const flap = Math.sin(clock.getElapsedTime() * 7 + offset * 2) * 0.6;
    if (leftWingRef.current && rightWingRef.current) {
      leftWingRef.current.rotation.z = flap;
      rightWingRef.current.rotation.z = -flap;
    }
  });

  return (
    <group ref={birdRef}>
      {/* Bird Fuselage / Body */}
      <mesh>
        <coneGeometry args={[0.15, 0.8, 5]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.48, 0]}>
        <coneGeometry args={[0.06, 0.25, 4]} />
        <meshStandardMaterial color="#FF9E00" />
      </mesh>
      {/* Left Wing */}
      <group ref={leftWingRef} position={[-0.1, 0.1, 0]}>
        <mesh position={[-0.45, 0, 0]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.8, 0.03, 0.3]} />
          <meshStandardMaterial color="#00E5FF" roughness={0.4} />
        </mesh>
      </group>
      {/* Right Wing */}
      <group ref={rightWingRef} position={[0.1, 0.1, 0]}>
        <mesh position={[0.45, 0, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.8, 0.03, 0.3]} />
          <meshStandardMaterial color="#00E5FF" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};

export const MigratoryBirds = () => {
  return (
    <group>
      {/* V-formation flock soaring over JU Lake */}
      <Bird offset={0.0} speed={0.9} baseAltitude={4.8} radius={8.0} />
      <Bird offset={0.4} speed={0.9} baseAltitude={5.1} radius={8.8} />
      <Bird offset={-0.4} speed={0.9} baseAltitude={4.6} radius={7.4} />
      <Bird offset={0.8} speed={0.9} baseAltitude={5.3} radius={9.4} />
      <Bird offset={-0.8} speed={0.9} baseAltitude={4.3} radius={6.8} />
    </group>
  );
};
