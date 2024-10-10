import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { FlyControls } from '@react-three/drei';
import * as THREE from 'three';

function App() {
  const heightmapImage = "https://i.imgur.com/LJ0F8QF.png";
  const originalImage = "https://i.imgur.com/2uUjPaA.png";
  const [groundMesh, setGroundMesh] = useState(null);
  const groundGeo = new THREE.PlaneGeometry(1000, 1000, 256, 256);


  useEffect(() => {
    let disMap = new THREE.TextureLoader().load(heightmapImage);
    disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
    disMap.repeat.set(1, 1)

    const colorMap = new THREE.TextureLoader().load(originalImage);
    colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
    colorMap.repeat.set(1, 1);

    const groundMap = new THREE.MeshStandardMaterial({
      map: colorMap,
      displacementMap: disMap,
      displacementScale: 100
    });

    let mesh = new THREE.Mesh(groundGeo, groundMap)
    setGroundMesh(mesh); 
  }, [])

  return (
    <div id="site-content">
       <Canvas camera={{
                position: [0, 150, 100], // X, Y, Z coordinates for the spawn point
                fov: 75, // Field of view (optional)
              }}>
       <ambientLight intensity={0.5} />
        <directionalLight color="white" intensity={1} position={[0, 10, 5]} />
        <directionalLight color="white" intensity={0.5} position={[-5, -5, 10]} />

        {groundMesh && (
          <primitive object={groundMesh} rotation={[-Math.PI / 2, 0, 0]} />
        )}

        <FlyControls
          movementSpeed={100}
          rollSpeed={0.5}
          dragToLook={false}
        />
       </Canvas>

    </div>
  )
}

export default App
