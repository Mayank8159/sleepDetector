"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  landmarks: {
    leftEye?: [number, number, number];
    rightEye?: [number, number, number];
  } | null;
}

export default function ThreeFace({ landmarks }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1);
    scene.add(light);

    // Eye spheres
    const geometry = new THREE.SphereGeometry(0.05, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const leftEye = new THREE.Mesh(geometry, material);
    const rightEye = new THREE.Mesh(geometry, material);
    leftEye.position.x = -0.1;
    rightEye.position.x = 0.1;
    scene.add(leftEye, rightEye);

    const animate = function () {
      requestAnimationFrame(animate);

      // Only update if landmarks exist
      if (landmarks?.leftEye && landmarks?.rightEye) {
        leftEye.position.set(
          landmarks.leftEye[0],
          landmarks.leftEye[1],
          landmarks.leftEye[2] || 0
        );
        rightEye.position.set(
          landmarks.rightEye[0],
          landmarks.rightEye[1],
          landmarks.rightEye[2] || 0
        );
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [landmarks]); // ✅ fixed dependency array

  return (
    <div
      ref={mountRef}
      className="w-full h-[400px] lg:h-[500px] bg-gray-800 rounded-lg"
    />
  );
}
