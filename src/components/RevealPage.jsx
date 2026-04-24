import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Clone, Float } from '@react-three/drei';

function GiftOne3D() {
  const { scene } = useGLTF('/models/Gift1.glb');
  
  return (
    <Float rotationIntensity={1.5} floatIntensity={1.5} speed={2}>
      {/* 
        Intentionally omitting <Center> here to prevent WebGL crash due to 2KB empty bounds.
        If the file becomes valid, it will render correctly hovering.
      */}
      <Clone object={scene} scale={2} />
    </Float>
  );
}

export function RevealPage({ setCurrentPage }) {
  const [stage, setStage] = useState('animation'); // 'animation' -> 'interactive'
  const webpUrl = '/models/VideoProject-ezgif.com-video-to-webp-converter.webp';

  // Automatically transition after a fixed duration (since WebP natively lacks onEnded callbacks)
  // We approximate 4 seconds. The user can tweak this if the animation is longer.
  useEffect(() => {
    if (stage === 'animation') {
      const timer = setTimeout(() => {
        setStage('interactive');
      }, 4000); 
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column', // Base column, but row inside interactive state
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        overflow: 'hidden'
      }}
    >
      
      <AnimatePresence mode="wait">
        {/* STAGE 1: Playing the WebP Sequence */}
        {stage === 'animation' && (
          <motion.div
            key="stage-anim"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            style={{
              width: '80%',
              maxWidth: '800px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.02)'
            }}
          >
            <img 
              src={webpUrl} 
              alt="Gift Reveal Animation" 
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                pointerEvents: 'none'
              }}
            />
          </motion.div>
        )}

        {/* STAGE 2: Interactive 3D Model with Details Panel! */}
        {stage === 'interactive' && (
          <motion.div
            key="stage-interactive"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6vw',
              padding: '0 10vw'
            }}
          >
            {/* The Text Details Panel */}
            <div style={{ flex: 1, zIndex: 10, maxWidth: '500px' }}>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{
                  color: 'white',
                  fontSize: 'clamp(2.5rem, 4vw, 4.5rem)',
                  fontWeight: 800,
                  margin: 0,
                  letterSpacing: '-1px',
                  textShadow: '0 4px 20px rgba(0,0,0,0.8)'
                }}
              >
                The 1st Artifact
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '1.2rem',
                  lineHeight: '1.6',
                  marginTop: '20px',
                  fontWeight: 300
                }}
              >
                Congratulations! You’ve unlocked the very first secret treasure.
                This item represents the first step of the journey, crafted intricately in 3D space with a premium feel. 
                Hover around and inspect its glowing details.
              </motion.p>
            </div>

            {/* The 3D Render Panel */}
            <div style={{ flex: 1, height: '60vh', position: 'relative' }}>
              <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
                <ambientLight intensity={1.5} color="#ffffff" />
                <spotLight position={[10, 20, 10]} intensity={3} penumbra={1} color="#ffebba" castShadow />
                <spotLight position={[-10, 10, -10]} intensity={2.5} color="#88b1ff" />
                <Environment preset="studio" blur={0.8} />
                
                <Suspense fallback={null}>
                   <GiftOne3D />
                </Suspense>

                <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={15} blur={2.5} far={10} color="#000000" />
                
                <OrbitControls 
                  makeDefault 
                  autoRotate
                  autoRotateSpeed={2}
                  enableZoom={true} 
                  enablePan={false}
                  enableDamping={true}
                  dampingFactor={0.05}
                />
              </Canvas>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Go Back Button - ALWAYS PRESENT BUT MOVES TO STAGE */}
      <motion.button
        // Animate visibility based on stage!
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: stage === 'animation' ? 0.3 : 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={() => setCurrentPage('landing')}
        style={{
          position: 'absolute',
          bottom: '8vh',
          padding: '16px 40px',
          fontSize: '1.1rem',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50px',
          cursor: stage === 'animation' ? 'default' : 'pointer',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'all 0.3s ease',
          pointerEvents: stage === 'animation' ? 'none' : 'auto'
        }}
        onMouseEnter={(e) => {
          if (stage === 'interactive') {
            e.target.style.background = 'rgba(255,255,255,0.15)';
            e.target.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (stage === 'interactive') {
             e.target.style.background = 'rgba(255,255,255,0.08)';
             e.target.style.transform = 'translateY(0)';
          }
        }}
      >
        Start Over
      </motion.button>
    </motion.div>
  );
}
