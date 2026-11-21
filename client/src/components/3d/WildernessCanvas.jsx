import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { WildernessTerrain } from './WildernessTerrain';
import { FoxMascot } from './FoxMascot';
import { MigratoryBirds } from './MigratoryBirds';
import * as THREE from 'three';

// Parallax Camera Rig that responds smoothly to mouse or touch position
const CameraParallaxRig = () => {
  useFrame(({ camera, pointer }) => {
    // Smooth dampening to pointer coordinates
    const targetX = pointer.x * 2.2;
    const targetY = 3.6 + pointer.y * 1.0;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.lookAt(0, 1.0, 0.5);
  });
  return null;
};

export const WildernessCanvas = () => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 4.2, 9.5], fov: 45 }}
        dpr={[1, 1.5]} // Throttled for smooth 60fps on mobile & high-DPI screens
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        shadows
      >
        <Suspense fallback={null}>
          <CameraParallaxRig />

          {/* Sunset Neon & Wilderness Atmosphere Lighting */}
          <ambientLight intensity={0.7} color="#0B132B" />
          {/* Golden Fox Amber Sun Directional Light */}
          <directionalLight
            position={[8, 12, 6]}
            intensity={1.8}
            color="#FF9E00"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          {/* Migratory Teal Horizon Fill */}
          <pointLight position={[-8, 4, 3]} intensity={1.5} color="#00E5FF" />
          {/* Sunset Magenta Rim Light */}
          <pointLight position={[0, 6, -6]} intensity={1.4} color="#FF2A85" />

          {/* JU Campus Wilderness Scene */}
          <WildernessTerrain />
          <FoxMascot position={[0, 0, 0]} />
          <MigratoryBirds />
        </Suspense>
      </Canvas>
    </div>
  );
};
