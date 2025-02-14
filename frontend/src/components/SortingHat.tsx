"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const SortingHat: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  // Angular velocity for rotation
  const angularVelocityRef = useRef<number>(0);
  // Track dragging state and last mouse position
  const isDraggingRef = useRef<boolean>(false);
  const lastMouseXRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Get container size
    const { clientWidth, clientHeight } = mountRef.current;

    // Create scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, // FOV
      clientWidth / clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(clientWidth, clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Load the Sorting Hat model
    const loader = new GLTFLoader();
    loader.load(
      "./sorting_hat.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);

        // Center the model using its bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center); // Shift so its center is at (0,0,0)

        modelRef.current = model;
        scene.add(model);

        // Set the camera position to fully view the model
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 2;
        camera.position.set(0, 0, cameraZ);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // Animation loop: update rotation based on angular velocity
        const animate = () => {
          requestAnimationFrame(animate);
          if (modelRef.current) {
            // Update rotation using current angular velocity
            modelRef.current.rotation.y += angularVelocityRef.current;
            // Apply friction to gradually reduce angular velocity
            angularVelocityRef.current *= 0.98;
          }
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (error) => {
        console.error("Error loading Sorting Hat model:", error);
      }
    );

    // Mouse event handlers for dragging to adjust rotation speed

    // On mousedown, mark dragging and store the mouse X position
    const onMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      lastMouseXRef.current = event.clientX;
    };

    // On mousemove, if dragging, compute horizontal delta and update angular velocity
    const onMouseMove = (event: MouseEvent) => {
      if (isDraggingRef.current && modelRef.current) {
        const deltaX = event.clientX - lastMouseXRef.current;
        // Increase angular velocity proportionally to horizontal movement
        // Adjust the multiplier to control sensitivity
        angularVelocityRef.current += deltaX * 0.001;
        lastMouseXRef.current = event.clientX;
      }
    };

    // On mouseup, end dragging
    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Handle resize
    const onResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default SortingHat;
