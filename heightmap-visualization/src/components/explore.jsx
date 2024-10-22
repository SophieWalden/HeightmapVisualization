import { useState, useEffect } from 'react';
import '../App.css';
import { Canvas } from '@react-three/fiber';
import { FlyControls } from '@react-three/drei';
import * as THREE from 'three';
import originalPositions from '../../src/path.json';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

function Explore() {
  const heightmapImage = "https://i.imgur.com/LJ0F8QF.png";
  const originalImage = "https://i.imgur.com/2uUjPaA.png";
  const [groundMesh, setGroundMesh] = useState(null);
  const groundGeo = new THREE.PlaneGeometry(3313, 986, 256, 256);
  const scale = 2.59;
  const pathHeight = 140; 
  const scaledPositions = originalPositions.map(([x, y]) => [x * scale, -y * scale]); 

  const sampleRate = 30; 

  useEffect(() => {
    const disMap = new THREE.TextureLoader().load(heightmapImage);
    disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
    disMap.repeat.set(1, 1);

    const colorMap = new THREE.TextureLoader().load(originalImage);
    colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
    colorMap.repeat.set(1, 1);

    const groundMap = new THREE.MeshStandardMaterial({
      map: colorMap,
      displacementMap: disMap,
      displacementScale: 100,
    });

    const mesh = new THREE.Mesh(groundGeo, groundMap);
    setGroundMesh(mesh);
  }, [heightmapImage, originalImage]);

  useEffect(() => {
    if (!groundMesh) return;

    const pathPoints = [];
    const offset = [-1700, 450, -90]
    for (let i = 0; i < scaledPositions.length; i += sampleRate) {
      const [x, y] = scaledPositions[i];
      const z = pathHeight;
      pathPoints.push(new THREE.Vector3(x + offset[0], y + offset[1], z + offset[2] + i * -0.02));
    }

    console.log(`Total path points: ${pathPoints.length}`);
    const lineGeometry = new LineGeometry();
    lineGeometry.setPositions(pathPoints.flatMap(point => [point.x, point.y, point.z]));

    const lineMaterial = new LineMaterial({
      color: 0xff0000,
      linewidth: 10, 
      depthTest: true,
      transparent: true,
    });

    const line = new Line2(lineGeometry, lineMaterial);
    line.computeLineDistances();

    groundMesh.add(line)

    return () => {
      groundMesh.remove(line);
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, [groundMesh]); 

  

  return (
    <div id="explore-container">
      <Canvas camera={{ position: [0, 150, 100], fov: 75}}>
        <ambientLight intensity={0.5} />
        <directionalLight color="white" intensity={1} position={[0, 10, 5]} />
        <directionalLight color="white" intensity={0.5} position={[-5, -5, 10]} />

        {groundMesh && (
          <primitive object={groundMesh} rotation={[-Math.PI / 2, 0, 0]} />
        )}

        <FlyControls movementSpeed={100} rollSpeed={0.5} dragToLook={false} />
      </Canvas>
    </div>
  );
}

export default Explore;
