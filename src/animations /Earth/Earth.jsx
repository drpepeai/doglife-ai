import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function Model(props) {
  const { nodes, materials } = useGLTF(`${process.env.PUBLIC_URL}/animations/earth/earth.gltf`);


  const groupRef = useRef();


  useFrame(() => {
    if (groupRef.current) {
  
      groupRef.current.rotation.y += 0.01;  
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null} scale={[0.5, 0.5, 0.5]}>
      <mesh geometry={nodes.Object_4.geometry} material={materials['Scene_-_Root']} scale={2} />
    </group>
  );
}

useGLTF.preload(`${process.env.PUBLIC_URL}/animations/earth/earth.gltf`);
