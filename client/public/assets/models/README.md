# 3D Model Asset Directory

This directory is designated for custom `.glb` / `.gltf` 3D assets for **Adventure Fest 3.0**:

- `fox_mascot.glb` — High-detail 3D model for the Golden Jackal / Fox mascot.
- `migratory_bird.glb` — 3D model for Siberian migratory birds.
- `ju_campus_terrain.glb` — Cel-shaded campus diorama (Lakes, Red Brick, Trees).

### Procedural Fallback Geometries:
If `.glb` files are omitted, the application uses built-in high-performance Three.js procedural geometries with cel-shaded low-poly shaders, maintaining 60 FPS on both mobile and desktop browsers with zero broken geometries or missing asset errors.
