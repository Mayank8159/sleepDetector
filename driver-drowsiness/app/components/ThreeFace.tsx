"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  // Mediapipe returns an array of 468 landmarks, each with x,y,z
  landmarks: { x: number; y: number; z: number }[] | null;
}

export default function ThreeFace({ landmarks }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<THREE.Points | null>(null);       // ✅ fixed
  const animationIdRef = useRef<number | null>(null);         // ✅ fixed
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1);
    scene.add(light);

    // Geometry for landmarks (468 points)
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(468 * 3);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x00ff00,
      size: 0.02,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    pointsRef.current = points;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // ✅ Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight || 400;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update landmark positions when new data arrives
  useEffect(() => {
    if (landmarks && pointsRef.current) {
      const positions = (pointsRef.current.geometry as THREE.BufferGeometry)
        .attributes.position as THREE.BufferAttribute;

      const scale = 2; // scale up for visibility
      for (let i = 0; i < landmarks.length; i++) {
        const lm = landmarks[i];
        positions.setXYZ(
          i,
          (lm.x - 0.5) * scale, // center around 0
          -(lm.y - 0.5) * scale, // flip Y
          lm.z * scale
        );
      }
      positions.needsUpdate = true;
    }
  }, [landmarks]);

  return (
    <div
      ref={mountRef}
      className="w-full h-[50vh] bg-gray-800 rounded-lg"
    />
  );
}