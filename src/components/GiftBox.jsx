import React, { useRef } from 'react';
import { useGLTF, Clone } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion-3d';

export function GiftBox({ isOpen, setIsOpen }) {
  const boxModel = useGLTF('/models/Boxnew.glb');
  const lidModel = useGLTF('/models/lidnew.glb');
  const itemsModel = useGLTF('/models/11boxesnew.glb');

  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smoothly tilt forward by ~22 degrees (0.4 radians) when open to reveal insides perfectly
      const targetRotationX = isOpen ? 0.4 : 0;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.08;
    }
  });

  return (
    <group ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        // e.delta measures the pixel distance the mouse moved between mousedown and mouseup
        // If the user drags to rotate the box, delta will be > 5. We only want pure clicks!
        if (e.delta <= 5) {
          setIsOpen(!isOpen);
        }
      }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}>

      {/* The Main Box - Stays in original position. Clone fixes disappearing primitive bugs in R3F. */}
      <Clone object={boxModel.scene} />

      {/* The 11 inner items - keep their original position. Setup so they stay inside and don't pop out! */}
      <Clone object={itemsModel.scene} />

      {/* The Lid - Stays exactly on top until clicked, then moves up and leans back */}
      <motion.group
        initial={{ y: 0, rotateX: 0, z: 0, rotateZ: 0 }}
        animate={{
          y: isOpen ? 2 : 0,
          z: isOpen ? -1.5 : 0,
          rotateX: isOpen ? -0.8 : 0
        }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
      >
        <Clone object={lidModel.scene} />
      </motion.group>

    </group>
  );
}

useGLTF.preload('/models/Boxnew.glb');
useGLTF.preload('/models/lidnew.glb');
useGLTF.preload('/models/11boxesnew.glb');
