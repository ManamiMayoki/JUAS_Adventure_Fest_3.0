import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { WildernessTerrain } from './WildernessTerrain';
import { FoxMascot } from './FoxMascot';
import { MigratoryBirds } from './MigratoryBirds';
import * as THREE from 'three';

// Parallax Camera Rig with smooth responsive tracking
const CameraParallaxRig = () => {
  useFrame(({ camera, pointer }) => {
    const targetX = pointer.x * 2.2;
    const targetY = 3.6 + pointer.y * 0.9;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.lookAt(0, 0.9, 0.5);
  });
  return null;
};

export const WildernessCanvas = () => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 4.0, 9.2], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        shadows
      >
        <Suspense fallback={null}>
          <CameraParallaxRig />

          {/* Deep dusk fog for cinematic atmospheric depth */}
          <fog attach="fog" args={['#0B1120', 14, 32]} />

          {/* Balanced Ambient Light: Soft, natural illumination without blowing out */}
          <ambientLight intensity={0.65} color="#E2E8F0" />

          {/* Soft Hemisphere Light: Gentle sky fill and subtle grass bounce */}
          <hemisphereLight skyColor="#38BDF8" groundColor="#164E35" intensity={0.55} />

          {/* Warm Golden Hour Directional Sunlight */}
          <directionalLight
            position={[6, 12, 6]}
            intensity={1.6}
            color="#FFC87A"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0005}
          />

          {/* Subtle Lake Teal Accent */}
          <pointLight position={[-4, 3, 3]} intensity={1.0} distance={16} color="#00E5FF" />

          {/* Subtle Sunset Magenta Rim Accent */}
          <pointLight position={[0, 5, -5]} intensity={0.9} distance={18} color="#FF2A85" />

          {/* 3D Scene Assets */}
          <WildernessTerrain />
          <FoxMascot position={[0, 0, 0]} />
          <MigratoryBirds />
        </Suspense>
      </Canvas>
    </div>
  );
};
