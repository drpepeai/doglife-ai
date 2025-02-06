import React from "react";
import './animation.css';
import { OrbitControls } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Earth from '../animations /Earth/Earth';  





const Animations = () => {


  return (
    <>
      <Canvas>
        <ambientLight intensity={1}/>
        <OrbitControls enableZoom={false} />
        <Suspense fallback={null}>
            <Earth />
          </Suspense>
          <Environment preset="sunset" />
      </Canvas>
    </>
  );
};

export default Animations;


