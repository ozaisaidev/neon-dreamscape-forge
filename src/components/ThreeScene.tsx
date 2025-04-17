
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  sceneType: 'aboutMe' | 'projects' | 'gameRoom';
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ sceneType }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Initialize Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Custom scene objects based on the sceneType
    const objects: THREE.Mesh[] = [];
    
    if (sceneType === 'aboutMe') {
      // ML Brain object (sphere with wireframe)
      const brainGeometry = new THREE.SphereGeometry(1, 16, 16);
      const brainMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFF5277, 
        wireframe: true 
      });
      const brain = new THREE.Mesh(brainGeometry, brainMaterial);
      brain.position.set(-2, 0, 0);
      scene.add(brain);
      objects.push(brain);
      
      // Rust crab (cube for simplicity)
      const crabGeometry = new THREE.BoxGeometry(1, 1, 1);
      const crabMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3BF4FB,
        specular: 0xffffff
      });
      const crab = new THREE.Mesh(crabGeometry, crabMaterial);
      crab.position.set(0, 0, 0);
      scene.add(crab);
      objects.push(crab);
      
      // F1 car (torus for simplicity)
      const carGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
      const carMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8352FD
      });
      const car = new THREE.Mesh(carGeometry, carMaterial);
      car.position.set(2, 0, 0);
      scene.add(car);
      objects.push(car);
    } 
    else if (sceneType === 'projects') {
      // Project card representation (flat plane with texture)
      const cardGeometry = new THREE.PlaneGeometry(2, 1.5);
      const cardMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x3BF4FB,
        side: THREE.DoubleSide
      });
      const card = new THREE.Mesh(cardGeometry, cardMaterial);
      scene.add(card);
      objects.push(card);
    }
    else if (sceneType === 'gameRoom') {
      // Game room objects
      const gameGeometry = new THREE.IcosahedronGeometry(1, 0);
      const gameMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFF5277,
        specular: 0xffffff,
        shininess: 100
      });
      const game = new THREE.Mesh(gameGeometry, gameMaterial);
      scene.add(game);
      objects.push(game);
    }
    
    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      objects.forEach(obj => {
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      objects.forEach(obj => {
        obj.rotation.x += mouseY * 0.01;
        obj.rotation.y += mouseX * 0.01;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [sceneType]);
  
  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 -z-10 opacity-70"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default ThreeScene;
