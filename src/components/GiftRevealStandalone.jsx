import React, { Suspense, useMemo, useState } from 'react';
import { motion as motionDOM, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Center, useGLTF, Bounds } from '@react-three/drei';
import * as THREE from 'three';
import { GAME_DATA } from './GiftsPage';
import WebcamCapture from './WebcamCapture';
import './GiftRevealStandalone.css';

// Reuse the fallback logic if needed
function getGameData(originalName) {
  const cleanName = originalName.replace(/[^a-zA-Z0-9]/g, '');
  const mathcingKey = Object.keys(GAME_DATA).find(key => key.toLowerCase() === cleanName.toLowerCase());
  
  if (mathcingKey && GAME_DATA[mathcingKey]) return GAME_DATA[mathcingKey];
  
  return {
    answer: "gift",
    title: `Mystery Design (${originalName})`,
    desc: `Unique Design Revealed!`
  };
}

// 3D Model logic isolated for a single item
function IsolatedRevealModel({ giftId }) {
  const { scene } = useGLTF(`/models/${giftId}.glb`); // Dynamically load specific 2KB GLB to prevent WebGL exhaustion!
  
  // Clone the entire scene to prevent mutating the cached version
  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        // Fix inverted normals permanently for all internal sub-meshes
        child.material = child.material.clone();
        child.material.side = THREE.DoubleSide;
      }
    });
    
    return cloned;
  }, [scene]);

  return (
    <Center>
      <primitive object={clonedScene} scale={8} />
    </Center>
  );
}


export default function GiftRevealStandalone({ giftId, onClose, isLastGift, onSaveMemory, isCaptureBypassed, onBypassCapture }) {
  const [showWebcam, setShowWebcam] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  if (!giftId) return null; // Safety catch

  const data = getGameData(giftId);
  const isUltimate = giftId === 'Gift11';

  return (
    <motionDOM.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="reveal-standalone-container"
    >
      {/* 3D Context Layer - Completely decoupled from main loop */}
      <div className="reveal-standalone-canvas">
        <Canvas camera={{ position: [0, 3, 10], fov: 45 }}>
          <ambientLight intensity={2.0} color="#ffffff" />
          <spotLight position={[10, 20, 10]} intensity={4} penumbra={1} color={isUltimate ? "#ffd700" : "#ffebba"} castShadow />
          <spotLight position={[-10, 10, -10]} intensity={2.5} color="#88b1ff" />
          
          <Environment preset="studio" blur={0.8} />
          
          <Suspense fallback={null}>
             <Bounds fit clip margin={1.8}>
               <IsolatedRevealModel giftId={giftId} />
             </Bounds>
          </Suspense>

          <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={20} blur={3.0} color="#000000" />
          
          {/* Unrestricted user rotation */}
          <OrbitControls 
            makeDefault 
            autoRotate
            autoRotateSpeed={1.5}
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2 + 0.1}
            enableZoom={true} 
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>

      {/* HTML Overlay Panel Layer */}
      <div className="reveal-standalone-ui">
        <motionDOM.div
          key="detailspanel"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`reveal-panel ${isUltimate ? 'ultimate' : 'standard'}`}
          style={{ marginTop: '50vh' }}
        >
          {isUltimate && (
            <motionDOM.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              style={{ fontSize: '3rem', marginBottom: '10px' }}
            >
              🎉✨🏆✨🎉
            </motionDOM.div>
          )}

          <h2 className="reveal-panel-title" style={{ 
            color: isUltimate ? '#ffd700' : '#e0c097',
            fontSize: isUltimate ? '2.5rem' : '2rem',
            textShadow: isUltimate ? '0 0 30px rgba(255,215,0,0.6)' : 'none'
          }}>
            {isUltimate && <span style={{ display: 'block', fontSize: '1rem', color: 'rgba(255,215,0,0.7)', marginBottom: '8px' }}>🎁 THE FINAL GIFT</span>}
            {data.title}
          </h2>

          <AnimatePresence mode="wait">
              <motionDOM.div key="brief" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p className="reveal-panel-desc">
                  {data.desc}
                </p>
                {isCaptureBypassed ? (
                   <button
                      onClick={() => {
                         if (isClosing) return;
                         setIsClosing(true);
                         onClose();
                      }}
                      className={`reveal-return-btn ${isUltimate ? 'ultimate-btn' : 'standard-btn'}`}
                   >
                      {isLastGift ? '🎊 Complete Unboxing!' : 'Return to Gallery'}
                   </button>
                ) : (
                   <>
                      <button
                         onClick={() => setShowWebcam(true)}
                         className={`reveal-return-btn ${isUltimate ? 'ultimate-btn' : 'standard-btn'}`}
                      >
                         {isLastGift ? '🎊 Capture Memory & Complete!' : 'Capture Memory & Return'}
                      </button>
                      {giftId === 'Gift1' && (
                        <button
                           onClick={() => {
                              if (isClosing) return;
                              setIsClosing(true);
                              if (onBypassCapture) onBypassCapture();
                              onClose();
                           }}
                           className={`reveal-return-btn standard-btn`}
                           style={{ marginTop: '15px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.8)' }}
                        >
                           Return to Gallery
                        </button>
                      )}
                   </>
                )}
              </motionDOM.div>
          </AnimatePresence>
        </motionDOM.div>
      </div>

      <AnimatePresence>
        {showWebcam && (
          <WebcamCapture
            currentGift={data.title}
            onCapture={(base64) => {
              if (isClosing) return;
              setIsClosing(true);
              if (onSaveMemory) onSaveMemory(giftId, base64);
              onClose();
            }}
            onCancel={() => {
              if (isClosing) return;
              setIsClosing(true);
              onClose();
            }}
          />
        )}
      </AnimatePresence>

    </motionDOM.div>
  );
}

['Gift1', 'Gift2', 'Gift3', 'Gift4', 'Gift5', 'Gift6', 'Gift7', 'Gift8', 'Gift9', 'Gift10', 'Gift11'].forEach(id => {
  useGLTF.preload(`/models/${id}.glb`);
});
