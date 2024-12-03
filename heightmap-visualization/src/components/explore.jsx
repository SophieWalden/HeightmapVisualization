import { useState, useEffect, useRef, forwardRef } from 'react';
import '../App.css';
import { Canvas, useThree } from '@react-three/fiber';
import { FlyControls } from '@react-three/drei';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { useGLTF } from '@react-three/drei';
import { CSSProperties } from "react";
import CircleLoader from "react-spinners/ClipLoader";

import positions1 from '../../src/path.json';
import positions2 from '../../src/path2.json';
import positions3 from '../../src/path3.json';
import positions4 from '../../src/path4.json';
import positions5 from '../../src/path5.json';

const RoverModel = forwardRef(({ position, loading, setLoading }, ref) => {
  const { scene } = useGLTF('/HeightmapVisualization/scene.gltf');
  if (loading == true) setLoading(false);
  scene.scale.set(0.00035, 0.00035, 0.00035); 
  return <primitive object={scene} position={position} ref={ref} />;
});


function CameraControl({ position, fov, near, far, rotation, changePositionCommand, activeCamera }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...position); 
    camera.fov = fov;                
    camera.near = near;         
    camera.far = far;                
    camera.rotation.set(...rotation);
    camera.updateProjectionMatrix();  

    camera.lookAt(0, 0, 0);        
  }, []);

  useEffect(() => {
    if (changePositionCommand[0] !== 0 || changePositionCommand[1] !== 0 || changePositionCommand[2] !== 0 && activeCamera=="rover") {
      let animationId;
  
      const animateCameraPosition = () => {
        const targetPosition = new THREE.Vector3(...changePositionCommand);
        camera.position.lerp(targetPosition, 0.1); 
  
        if (camera.position.distanceTo(targetPosition) > 0.01 && activeCamera == 'rover') {
          animationId = requestAnimationFrame(animateCameraPosition);
        }
      };
  
      animateCameraPosition();
  
      return () => {
        cancelAnimationFrame(animationId);
      };
    }
  }, [changePositionCommand.x, changePositionCommand.y, changePositionCommand.z, activeCamera]);

  return null;
}

function Explore(props) {
  
  // Three things to set when adding a new heightmap
  const heightmaps = ["https://i.imgur.com/LJ0F8QF.png", "https://i.imgur.com/kNedcjy.png", "https://i.imgur.com/SwHm1Cy.png", "https://i.imgur.com/qJgQvHn.jpeg", "https://i.imgur.com/mjFrmVL.png"];
  const images = ["https://i.imgur.com/2uUjPaA.png", "https://i.imgur.com/Geop1Vf.jpeg", "https://i.imgur.com/mUJITfR.png", "https://i.imgur.com/qJgQvHn.jpeg", "https://i.imgur.com/1iT8xB5.png"]
  const finenesses = [60, 60, 60, 1, 60];
  
  
  
  
  
  
  const [groundMesh, setGroundMesh] = useState(null);
  const [size, setSize] = useState(1, 1);
  const [groundGeo, setGroundGeo] = useState(new THREE.PlaneGeometry(size[0], size[1], 256, 256))

  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState([-3313/2, 986/2,0]);
  const [scale, setScale] = useState([1, 1]);

  const [activeCamera, setActiveCamera] = useState('main');
  const roverCameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)); // Rover camera

  const positions = [positions1, positions2, positions3, positions4, positions5];
  const [visualizationIndex, setVisualizationIndex] = useState(1);
  let pathPoints = [];
  const [roverPoints, setRoverPoints] = useState([]);
  const [changePositionCommand, setChangePositionCommand] = useState([0, 0, 0])
  const [cameraPosition, setCameraPosition] = useState([0, 500, 250]);
  const defaultFov = 75;
  const defaultNear = 0.1;
  const defaultFar = 10000;
  const defaultRotation = [-Math.PI / 2, 0, 0];

  const sampleRate = 20; 

  useEffect(() => {

    document.body.style.overflow = loading ? "hidden" : "auto";
    if (loading == false) props.setFinishLoading(true);
  }, [loading]);
  
  useEffect(() => {
    // Function to load an image and return its dimensions
    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve({ width: img.width, height: img.height });
      });
    };

    Promise.all([loadImage(images[visualizationIndex])])
      .then(([originalDimensions]) => {

        setSize([originalDimensions.width, originalDimensions.height]);
        setOffset([-originalDimensions.width / 2, originalDimensions.height / 2, 0])

        setGroundGeo(new THREE.PlaneGeometry(originalDimensions.width, originalDimensions.height, 256, 256))
        const XScale = originalDimensions.width / positions[visualizationIndex]["size"][0];
        const YScale = originalDimensions.height / positions[visualizationIndex]["size"][1];

        setScale([XScale, YScale]);
      });
  }, [visualizationIndex]);

  useEffect(() => {
    const disMap = new THREE.TextureLoader().load(heightmaps[visualizationIndex]);
    disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
    disMap.repeat.set(1, 1);

    const colorMap = new THREE.TextureLoader().load(images[visualizationIndex]);
    colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
    colorMap.repeat.set(1, 1);

    const groundMap = new THREE.MeshStandardMaterial({
      map: colorMap,
      displacementMap: disMap,
      displacementScale: 100,
    });

    const mesh = new THREE.Mesh(groundGeo, groundMap);
    setGroundMesh(mesh);
  }, [visualizationIndex, groundGeo]);

  useEffect(() => {
    if (!groundMesh) return;

    for (let i = 0; i < positions[visualizationIndex]["path"].length; i += sampleRate) {
      const [x, y, z] = positions[visualizationIndex]["path"][i];
      pathPoints.push(new THREE.Vector3(x * scale[0] + offset[0], -z * scale[1] + offset[1], y * 0.5 + offset[2]));
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
  }, [groundMesh, scale[0], scale[1], groundGeo, offset, visualizationIndex]);

  const [index, setIndex] = useState(0);
  const roverRef = useRef(null);

  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3());

  useEffect(() => {
    let animationId;
  
    const animate = () => {
      if (roverPoints.length > 0) {
        if (roverRef.current) {
          const roverPosition = roverRef.current.position;


          const speed = 0.75 / finenesses[visualizationIndex]; 
  
          roverPosition.lerp(targetPosition, speed);
  
          const direction = new THREE.Vector3().subVectors(targetPosition, roverPosition);
          direction.y = 0; 
          if (direction.length() > 0.01) { 
            direction.normalize();
            const yaw = Math.atan2(direction.x, direction.z);
            roverRef.current.rotation.y = yaw;
          }
          if (activeCamera == 'rover'){
            // let point = [nextPoint.x, nextPoint.z, -nextPoint.y+5];
            let cameraPoint = new THREE.Vector3(roverPosition.x, roverPosition.y + 50, roverPosition.z)
            setChangePositionCommand(cameraPoint);
          }


          if (roverPosition.distanceTo(targetPosition) < finenesses[visualizationIndex]) {
            let nextIndex = (index + 1) ;

            if (nextIndex >= roverPoints.length){
              nextIndex = 0
              roverRef.current.position.x = roverPoints[0].x;
              roverRef.current.position.y = roverPoints[0].z;
              roverRef.current.position.z = -roverPoints[0].y;
            }

            const nextPoint = roverPoints[nextIndex];
            setTargetPosition(new THREE.Vector3(nextPoint.x, nextPoint.z, -nextPoint.y));
            setIndex(nextIndex);
          }
        }
  
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [roverPoints, index]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      if (key >= '0' && key <= heightmaps.length.toString()) {
        setVisualizationIndex(parseInt(key));
      }
      if (key == 'c'){
        setActiveCamera((oldActiveCamera) => oldActiveCamera == "main" ? "rover" : "main")
        
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);



  return (
    <div id="explore-container">

      <div className={`${loading ? "" : "hiddenDiv"}`} id="loading-div">
          <h3> Loading </h3>
          <CircleLoader
            className="loader"
            color={"#FFFFFF"}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>

      <div id="exploration-selector">
        {heightmaps.map((_, index) => {
          return (
            <h3 onClick={() => setVisualizationIndex(index)} className={`${visualizationIndex == index ? "chosenDisplay" : ""} button-38`} key={index}>{index}</h3>
          )
        })}
        <h3 onClick={() => setActiveCamera(activeCamera == "main" ? "rover" : "main")} className={`button-38`}>Change Camera</h3>
      </div>

     
        
        
  
      <Canvas className={`${loading ? "hideCanvas" : ""}`} id="canvas" >
      <CameraControl 
          position={cameraPosition}
          fov={defaultFov}
          near={defaultNear}
          far={defaultFar}
          rotation={defaultRotation} 
          changePositionCommand={changePositionCommand}
          activeCamera={activeCamera}
        />
        <ambientLight intensity={0.5} />
        <directionalLight color="white" intensity={1} position={[0, 10, 5]} />
        <directionalLight color="white" intensity={0.5} position={[-5, -5, 10]} />

        {groundMesh && (
          <primitive object={groundMesh} rotation={[-Math.PI / 2, 0, 0]} />
        )}

        <RoverModel loading={loading} setLoading={setLoading} position={[0, 0, 0]} ref={roverRef} />

        <FlyControls movementSpeed={100} rollSpeed={0.5} dragToLook={false} enableDamping={true}
  dampingFactor={0.25} />
      </Canvas>
    </div>
  );
}

export default Explore;
