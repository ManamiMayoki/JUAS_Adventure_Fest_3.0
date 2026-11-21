import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { WildernessTerrain } from './WildernessTerrain';
import { FoxMascot } from './FoxMascot';
import { MigratoryBirds } from './MigratoryBirds';
import * as THREE from 'three';

// Parallax Camera Rig with smooth responsive tracking
const CameraParallaxRig = () => {
  useFrame(({ camera, pointer }) => {
    const targetX = pointer.x * 2.4;
    const targetY = 3.6 + pointer.y * 1.0;
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

          {/* Horizon Fog for Atmospheric Depth */}
          <fog attach="fog" args={['#0E1726', 15, 34]} />

          {/* 1. Bright Ambient Light for High Visibility */}
          <ambientLight intensity={1.4} color="#F0F9FF" />

          {/* 2. Hemisphere Light: Sky Blue Above, Green Grass Bounce Below */}
          <hemisphereLight skyColor="#7DD3FC" groundColor="#34D399" intensity={1.2} />

          {/* 3. Golden Sun Directional Light casting crisp shadows */}
          <directionalLight
            position={[7, 14, 7]}
            intensity={2.6}
            color="#FFF7ED"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0005}
          />

          {/* 4. Secondary Sun Fill Light */}
          <directionalLight
            position={[-7, 10, -4]}
            intensity={1.2}
            color="#FED7AA"
          />

          {/* 5. Luminous Migratory Teal Point Light (Lake illumination) */}
          <pointLight position={[-5, 4, 3.5]} intensity={2.8} distance={22} color="#00E5FF" />

          {/* 6. Warm Amber Fox Point Light */}
          <pointLight position={[4, 3.5, 1]} intensity={2.4} distance={18} color="#FF9E00" />

          {/* 7. Sunset Magenta Rim Light */}
          <pointLight position={[0, 6, -5]} intensity={2.2} distance={20} color="#FF2A85" />

          {/* 3D Scene Assets */}
          <WildernessTerrain />
          <FoxMascot position={[0, 0, 0]} />
          <MigratoryBirds />
        </Suspense>
      </Canvas>
    </div>
  );
};
