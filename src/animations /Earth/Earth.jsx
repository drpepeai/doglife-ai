import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF(`${process.env.PUBLIC_URL}/animations/earth/earth.gltf`);

  return (
    <group {...props} dispose={null}  scale={[0.5, 0.5, 0.5]} >
      <mesh geometry={nodes.Object_4.geometry} material={materials['Scene_-_Root']} scale={2} />
    </group>
  )
}

useGLTF.preload(`${process.env.PUBLIC_URL}/animations/earth/earth.gltf`)
