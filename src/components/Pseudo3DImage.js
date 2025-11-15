// components/Pseudo3DImage.js
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { TextureLoader, Mesh, PlaneGeometry, MeshStandardMaterial } from "three";
import { OrbitControls } from "@react-three/drei";

function ImageWithDepth({ imageUrl, depthUrl }) {
  const meshRef = useRef();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Track mouse movement for parallax
  const handleMouseMove = (e) => {
    setMouse({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * -2,
    });
  };
  if (typeof window !== "undefined") window.addEventListener("mousemove", handleMouseMove);

  // Load textures
  const texture = new TextureLoader().load(imageUrl);
  const depthTexture = new TextureLoader().load(depthUrl);

  // Animate mesh
  useFrame(() => {
    if (!meshRef.current) return;

    // Basic pseudo-3D: move vertices based on depth map
    meshRef.current.rotation.y = mouse.x * 0.3;
    meshRef.current.rotation.x = mouse.y * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[3, 2, 64, 64]} />
      <meshStandardMaterial map={texture} displacementMap={depthTexture} displacementScale={0.5} />
    </mesh>
  );
}

export default function Pseudo3DScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ImageWithDepth imageUrl="/uploads/1761378327109-Untitled.png" depthUrl="/depth.jpg" />
      <OrbitControls enableZoom={true} enablePan={false} />
    </Canvas>
  );
}