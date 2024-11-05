import { useState, useEffect, useRef, forwardRef } from 'react';
import '../App.css';
import { Canvas } from '@react-three/fiber';
import { FlyControls } from '@react-three/drei';
import * as THREE from 'three';
import originalPositions from '../../src/path.json';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { useGLTF } from '@react-three/drei';

const RoverModel = forwardRef(({ position }, ref) => {
  const { scene } = useGLTF('/HeightmapVisualization/scene.gltf');
  scene.scale.set(0.00035, 0.00035, 0.00035); // Adjust the scale as needed
  return <primitive object={scene} position={position} ref={ref} />;
});

function Explore() {
  const offset = [-1700, 450, -90];
  const heightmapImage = "https://i.imgur.com/LJ0F8QF.png";
  const originalImage = "https://i.imgur.com/2uUjPaA.png";
  const [groundMesh, setGroundMesh] = useState(null);
  const groundGeo = new THREE.PlaneGeometry(3313, 986, 256, 256);
  const scale = 2.59;
  const pathHeight = 140; 
  const [activeCamera, setActiveCamera] = useState('main');
  const roverCameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)); // Rover camera

  const scaledPositions = originalPositions.map(([x, y]) => [x * scale, -y * scale]); 
  let pathPoints = [];
  const [roverPoints, setRoverPoints] = useState([]);

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

    for (let i = 0; i < scaledPositions.length; i += sampleRate) {
      const [x, y] = scaledPositions[i];
      const z = pathHeight;
      pathPoints.push(new THREE.Vector3(x + offset[0], y + offset[1], z + offset[2] + i * -0.02));
    }
    console.log(`Total path points: ${pathPoints.length}`);
    const lineGeometry = new LineGeometry();
    lineGeometry.setPositions(pathPoints.flatMap(point => [point.x, point.y, point.z]));
    setRoverPoints(pathPoints);

    const lineMaterial = new LineMaterial({
      color: 0xff0000,
      linewidth: 0, 
      depthTest: true,
      transparent: true,
    });

    const line = new Line2(lineGeometry, lineMaterial);
    line.computeLineDistances();

    groundMesh.add(line);

    return () => {
      groundMesh.remove(line);
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, [groundMesh]);

  const [index, setIndex] = useState(0);
  const roverRef = useRef(null);

  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3());

useEffect(() => {
  const interval = setInterval(() => {
    if (roverPoints.length > 0) {
      // Calculate the current and next index
      const currentIndex = index;
      const nextIndex = (currentIndex + 1) % roverPoints.length;
      
      const currentPoint = roverPoints[currentIndex];
      let nextPoint = roverPoints[nextIndex];
      nextPoint = new THREE.Vector3(nextPoint.x, nextPoint.z, -nextPoint.y);

      // Set the target position to the next point
      setTargetPosition(nextPoint.clone());

      // Move the rover smoothly towards the target position
      if (roverRef.current) {
        const roverPosition = roverRef.current.position;
        const speed = 0.6; // Adjust the speed as necessary

        // Lerp to the target position
        roverPosition.lerp(targetPosition, speed);
        
        // Update rotation based on direction to the target
        const direction = new THREE.Vector3().subVectors(targetPosition, roverPosition);
        direction.y = 0; // Keep Y zero for horizontal rotation
        if (direction.length() > 0.01) { // Only rotate if there's significant direction
          direction.normalize();
          const yaw = Math.atan2(direction.x, direction.z);
          roverRef.current.rotation.y = yaw;
        } else {
          // If close enough to the target, increment the index
          setIndex(nextIndex);
        }
      }
    }
  }, 100);

  return () => {
    clearInterval(interval);
  };
}, [roverPoints, index, targetPosition]);

  return (
    <div id="explore-container">
      <Canvas camera={{ position: [0, 500, 250], fov: 75,  near: 0.1, far: 10000, rotation: [-Math.PI / 2, 0, 0] }}>
        <ambientLight intensity={0.5} />
        <directionalLight color="white" intensity={1} position={[0, 10, 5]} />
        <directionalLight color="white" intensity={0.5} position={[-5, -5, 10]} />

        {groundMesh && (
          <primitive object={groundMesh} rotation={[-Math.PI / 2, 0, 0]} />
        )}

        <RoverModel position={[0, 0, 0]} ref={roverRef} />

        <FlyControls movementSpeed={100} rollSpeed={0.5} dragToLook={false} />
      </Canvas>
    </div>
  );
}

export default Explore;
