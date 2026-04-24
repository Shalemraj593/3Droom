import React, { Suspense, useState, useMemo, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Center, Bounds, useGLTF, Clone } from '@react-three/drei';
import { motion as motionDOM, AnimatePresence } from 'framer-motion';
import { motion as motion3D } from 'framer-motion-3d';
import * as THREE from 'three';
import FinalPremiumPicture from './FinalPremiumPicture';

// --------------------------------------------------------
// [CONFIG] 11 GIFTS MYSTERY DATA MAPPING
// --------------------------------------------------------
// Copy the exact MeshName shown in the UI when you click a box
// and paste it here perfectly matching its case!
export const GAME_DATA = {
  "Gift1": { answer: "gift1", title: "The Joyful Ascent", desc: "A bundle of colorful balloons representing the high spirits and happiness this day brings.", details: ["These balloons are more than just air and color; they are a symbol of the uplifting joy I wish for your entire birth month.", "I chose 'The Joyful Ascent' because your happiness should always go up. May your day be as light and cheerful as these floating treasures!"] },
  "Gift2": { answer: "gift2", title: "Luminous Wonder", desc: "Twinkling fairy lights designed to transform your space into a glowing, magical sanctuary.", details: ["'Luminous Wonder' is about the magic in the small things. These lights create a warm glow that reflects the kindness in your heart.", "Every twinkling bulb is a tiny reminder that the world is a brighter place with you in it. I hope they bring a sense of peace to your room."] },
  "Gift3": { answer: "gift3", title: "Eternal Connection", desc: "A state-of-the-art device to ensure we remain inseparable, regardless of the physical distance.", details: ["This is 'Eternal Connection' because our bond transcends space. It's a tool for us to share moments, laughs, and stories every single day.", "I wanted you to have the best window to our world. Stay close, stay connected, and always know that I'm just a call away."] },
  "Gift4": { answer: "gift4", title: "Sweet Vitality", desc: "Your favorite premium cashews—a delicious and energizing treat to fuel your celebration.", details: ["'Sweet Vitality' is all about the energy and health you bring into my life. These Jeedipapulu are your favorite for a reason!", "Enjoy the crunch! It's a small but powerful way to keep your spirits high and your energy fueled as you explore your surprises."] },
  "Gift5": { answer: "gift5", title: "Moody Mood Maker", desc: "The iconic reversible plushie that helps you express your emotions with a simple flip.", details: ["Meet the 'Moody Mood Maker'. Whether you're feeling happy or a bit sad, this little companion is here to speak for you.", "It's a reminder that every emotion is valid and that I'm here for you through all of them. Flip it whenever you need to share a feeling!"] },
  "Gift6": { answer: "gift6", title: "Armor of Elegance", desc: "A sleek and durable protective case that guards your connection with style and sophistication.", details: ["'Armor of Elegance' is the perfect companion for your new device. It's strong enough to protect and elegant enough to match you.", "Just as this case shields your phone from life's accidents, I'll always be here to support and protect you. Keep it safe and stylish!"] },
  "Gift7": { answer: "gift7", title: "The Milestone Memoir", desc: "A custom-framed calendar of your birth month—a permanent tribute to the day everything changed.", details: ["This frame is 'The Milestone Memoir' because it captures the most significant month of the year for me. It's a celebration of you.", "It's a piece of history turned into art. I hope it reminds you every day of how special your arrival was and how much you are cherished."] },
  "Gift8": { answer: "gift8", title: "Radiant Wristlet", desc: "A heart-shaped box hiding a delicate bracelet that adds a touch of radiance to your wrist.", details: ["Inside 'Radiant Wristlet' is a token of our bond. It's meant to be worn daily as a subtle, shining reminder of the love you carry.", "I hope this bracelet makes you feel radiant every time you see it. It's a small circle of affection that is always with you."] },
  "Gift9": { answer: "gift9", title: "Twinkling Accents", desc: "Exquisite earrings that serve as the perfect sparkling addition to your birthday ensemble.", details: ["'Twinkling Accents' are the finishing touch to your beauty. I picked these specifically to complement the sparkle in your eyes.", "They are small treasures for a rare gem like you. May they bring a little extra joy and shine to your special celebration!"] },
  "Gift10": { answer: "gift10", title: "Strength in Silver", desc: "An enduring and meaningful chain representing the resilience and faith that define you.", details: ["'Strength in Silver' is a symbol of the unbreakable chain of support and love that surrounds you. It's built to last, just like us.", "Wear this piece and feel the strength it represents. It's a timeless symbol of faith and the deep roots we have together."] },
  "Gift11": { answer: "gift11", title: "Infinite Echoes of Us", desc: "The ultimate collection of fifty handwritten reasons why you are the center of my universe.", details: ["'Infinite Echoes of Us' is the heart of this entire journey. It's fifty reasons why my life is better with you in it.", "Each message is an echo of a feeling I've had. Open them whenever you need to hear my voice and know how deeply you are loved."] }
};

function getGameData(originalName) {
  // Gracefully handle naming even if Blender exported it as 'gift1', 'GIFT1', or 'Gift.001'
  const cleanName = originalName.replace(/[^a-zA-Z0-9]/g, '');
  const mathcingKey = Object.keys(GAME_DATA).find(key => key.toLowerCase() === cleanName.toLowerCase());

  if (mathcingKey && GAME_DATA[mathcingKey]) return GAME_DATA[mathcingKey];

  // Safe Fallback for unconfigured boxes so the game never crashes!
  return {
    answer: "gift",
    title: `Mystery Design (${originalName})`,
    desc: `If this looks strange, tell your developers that this name wasn't detected in GAME_DATA. (Hint: Type "gift" to unlock!)`
  };
}


// Component that handles the Box gracefully fading and sinking away
function FadingBox({ isFading }) {
  const { scene } = useGLTF('./models/Boxnew.glb');

  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.transparent = true;
      }
    });
    return cloned;
  }, [scene]);

  useFrame((state, delta) => {
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const targetOpacity = isFading ? 0 : 1;
        child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, targetOpacity, delta * 1.2);
        child.visible = child.material.opacity > 0.05;
      }
    });
  });

  return (
    <motion3D.group
      initial={{ y: 0, scale: 1 }}
      animate={{ y: isFading ? -1 : 0, scale: isFading ? 0.95 : 1 }}
      transition={{ duration: 2.5, ease: "easeOut" }}
      style={{ pointerEvents: isFading ? 'none' : 'auto' }}
    >
      <primitive object={clonedScene} />
    </motion3D.group>
  );
}

// Powerfully manages native 3D Game interactions and cinematic reveals
function InteractiveGiftsScene({ visible, activeGuessBox, revealedBox, onBoxClick, unlockedGifts }) {
  const { scene: newItemsScene } = useGLTF('./models/11Newgifts.glb');

  // Safely clone the ENTIRE scene and its materials so we don't corrupt the cached GLTF across remounts!
  const safeScene = useMemo(() => {
    const clone = newItemsScene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.side = THREE.DoubleSide;
        child.material.needsUpdate = true;
        
        child.userData.originalX = child.position.x;
        child.userData.originalY = child.position.y;
        child.userData.originalZ = child.position.z;
        child.userData.originalRotZ = child.rotation.z;

        child.userData.baseScaleX = child.scale.x;
        child.userData.baseScaleY = child.scale.y;
        child.userData.baseScaleZ = child.scale.z;

        child.userData.isInteractiveItem = true;
      }
    });
    return clone;
  }, [newItemsScene]);

  // Smooth cinematic physics engine updates
  useFrame((state, delta) => {
    safeScene.traverse((child) => {
      if (child.isMesh && child.userData.isInteractiveItem) {

        // 1. CINEMATIC FLIGHT REVEAL MODE: Rocket the object towards the camera while making it undeniably premium
        if (revealedBox === child.name) {
          child.visible = true;

          // Center the reward correctly for manual inspection!
          child.position.x = THREE.MathUtils.lerp(child.position.x, 0, delta * 3);
          child.position.y = THREE.MathUtils.lerp(child.position.y, 0.5, delta * 3);
          child.position.z = THREE.MathUtils.lerp(child.position.z, 0, delta * 3);

          // Expand prominently to a flagship showcase 2.0x size!
          child.scale.x = THREE.MathUtils.lerp(child.scale.x, child.userData.baseScaleX * 2.0, delta * 3);
          child.scale.y = THREE.MathUtils.lerp(child.scale.y, child.userData.baseScaleY * 2.0, delta * 3);
          child.scale.z = THREE.MathUtils.lerp(child.scale.z, child.userData.baseScaleZ * 2.0, delta * 3);

          // NO auto-rotation! User rotates manually as requested.
        }

        // 2. REVEAL FILTER: When one is unlocked, hide the others for focus
        else if (revealedBox && revealedBox !== child.name) {
          child.visible = false;
        }

        // 3. DISCOVERED MODE: If they already collected it, it permanently vanishes.
        else if (unlockedGifts.includes(child.name)) {
          child.visible = false;
        }

        // 4. SECURE BACKGROUND HOLD (The ultimate crash prevention!)
        else if (!revealedBox) {
          child.visible = true; // Restore visibility
          const isSelected = (activeGuessBox === child.name);
          const liftOffset = 0.5; // Rise vertically
          const scaleFactor = 1.08;

          const targetY = isSelected ? child.userData.originalY + liftOffset : child.userData.originalY;
          const targetScaleX = isSelected ? child.userData.baseScaleX * scaleFactor : child.userData.baseScaleX;
          const targetScaleY = isSelected ? child.userData.baseScaleY * scaleFactor : child.userData.baseScaleY;
          const targetScaleZ = isSelected ? child.userData.baseScaleZ * scaleFactor : child.userData.baseScaleZ;

          // Silky smooth physical settling
          child.position.x = THREE.MathUtils.lerp(child.position.x, child.userData.originalX, delta * 4);
          child.position.y = THREE.MathUtils.lerp(child.position.y, targetY, delta * 4);
          child.position.z = THREE.MathUtils.lerp(child.position.z, child.userData.originalZ, delta * 4);

          child.rotation.z = THREE.MathUtils.lerp(child.rotation.z, child.userData.originalRotZ, delta * 5);

          child.scale.x = THREE.MathUtils.lerp(child.scale.x, targetScaleX, delta * 4);
          child.scale.y = THREE.MathUtils.lerp(child.scale.y, targetScaleY, delta * 4);
          child.scale.z = THREE.MathUtils.lerp(child.scale.z, targetScaleZ, delta * 4);
        }
      }
    });
  });

  return (
    <group>
      <primitive
        object={safeScene}
        visible={visible}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (visible && e.object.isMesh && e.object.userData.isInteractiveItem && !revealedBox && !unlockedGifts.includes(e.object.name)) {
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          if (visible && e.object.isMesh && e.object.userData.isInteractiveItem) {
            document.body.style.cursor = 'default';
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (visible && e.object.isMesh && e.object.userData.isInteractiveItem) {
            onBoxClick(e.object.name);
          }
        }}
      />
    </group>
  );
}

export function GiftsPage({ 
  setCurrentPage, 
  setIsOpen,
  targetSequenceIndex,
  setTargetSequenceIndex,
  unlockedGifts,
  setUnlockedGifts,
  isSandboxMode,
  setIsSandboxMode,
  setSelectedRevealGift
}) {
  // If the user is returning from a standalone reveal, the box has logically already been opened!
  const hasGameStarted = unlockedGifts.length > 0 || targetSequenceIndex > 1 || isSandboxMode;
  const [viewState, setViewState] = useState(hasGameStarted ? 'items' : 'box');
  const [showInteractiveItems, setShowInteractiveItems] = useState(hasGameStarted);
  const [showGift5Popup, setShowGift5Popup] = useState(false);

  // Game States!
  const [activeGuessBox, setActiveGuessBox] = useState(null);
  // revealedBox logic is now handled by GiftRevealStandalone.jsx, but we keep this variable constantly null 
  // to instantly satisfy the InteractiveGiftsScene component without rewriting its entire physics engine.
  const revealedBox = null; 
  const [pendingRevealBox, setPendingRevealBox] = useState(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const [feedbackMsg, setFeedbackMsg] = useState('');

  const { scene: oldItemsScene } = useGLTF('./models/11boxesnew.glb');

  // Clean up any inverted normal holes and enable FRUSTUM CULLING for performance!
  useMemo(() => {
    oldItemsScene.traverse((child) => {
      if (child.isMesh) {
        child.frustumCulled = true; // Optimization
        if (child.material) {
          child.material.side = THREE.DoubleSide;
        }
      }
    });
  }, [oldItemsScene]);

  useEffect(() => {
    let timer;
    if (viewState === 'items') {
      timer = setTimeout(() => {
        setShowInteractiveItems(true);
      }, 2500);
    } else {
      setShowInteractiveItems(false);
    }
    return () => clearTimeout(timer);
  }, [viewState]);

  // Handle Box Click Logic (Sequential game vs Sandbox play)
  const handleBoxClick = (meshName) => {
    if (isAnimating || revealedBox || pendingRevealBox) return; // Block spam clicks!

    if (isSandboxMode) {
      // In sandbox mode, immediately jump to reveal without guessing
      setSelectedRevealGift(meshName);
      setCurrentPage('reveal');
      return;
    }

    if (unlockedGifts.includes(meshName)) return; // Ignore removed ones!

    const expectedTarget = `Gift${targetSequenceIndex}`;

    if (meshName.toLowerCase() === expectedTarget.toLowerCase()) {
      setIsAnimating(true);
      setActiveGuessBox(meshName);

      const isLastGift = targetSequenceIndex === 11;
      setFeedbackMsg(isLastGift
        ? `🎉 YOU FOUND IT! The Final Secret is revealed!`
        : `🏆 YOU FOUND IT! You unlocked Gift ${targetSequenceIndex}!`);

      setTimeout(() => {
        setPendingRevealBox(meshName);
        setActiveGuessBox(null);
        setFeedbackMsg('');
        setIsAnimating(false);
      }, 1200);
    } else {
      setIsAnimating(true);
      setActiveGuessBox(meshName);

      const isLastGift = targetSequenceIndex === 11;
      setFeedbackMsg(isLastGift
        ? `🔍 Unlucky! You haven't found the Final Secret... keep searching!`
        : `❌ Unlucky! You haven't found Gift ${targetSequenceIndex} yet!`);

      setTimeout(() => {
        setActiveGuessBox(null);
        setFeedbackMsg('');
        setIsAnimating(false);
      }, 2000);
    }
  };

  return (
    <motionDOM.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'transparent',
        zIndex: 100,
      }}
    >
      {/* Keyframe animations for special Gift 11 effects */}
      <style>{`
        @keyframes pulse {
          from { opacity: 0.75; text-shadow: 0 0 20px rgba(255,215,0,0.5); }
          to   { opacity: 1.0;  text-shadow: 0 0 50px rgba(255,215,0,1.0), 0 0 80px rgba(255,200,0,0.6); }
        }
      `}</style>

      {/* 2D Premium Overlay Engine */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 10,
        padding: '20px'
      }}>

        {/* Dynamic Titles */}
        <header style={{ marginTop: '2vh', textAlign: 'center' }}>
          <motionDOM.h1
            key={`title-${viewState}-${revealedBox ? 'reveal' : 'normal'}`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              color: 'white',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              margin: 0,
              letterSpacing: '-1px'
            }}
          >
            {viewState === 'box' ? "Wow!! Box lid open chesavV" :
              revealedBox && targetSequenceIndex > 11 ? "🎉 Lorem Ipsum Dolor!" :
                revealedBox ? "Sit Amet Consectetur!" :
                  isSandboxMode ? "Lorem Ipsum Collection" :
                    targetSequenceIndex === 11 ? "🎁 Lorem Ipsum!" :
                      `Find Gift ${targetSequenceIndex}!`}
          </motionDOM.h1>

            <motionDOM.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginTop: '10px' }}
            >
              {viewState === 'box' ? "Late enti mari lopala em undo chuduuu" :
                isSandboxMode ? "You found them all! Click any box to view it." :
                  ""}
            </motionDOM.p>
          )}

          {isSandboxMode && (
             <motionDOM.button
                onClick={() => setShowFinal(true)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                style={{
                  marginTop: '15px',
                  padding: '10px 25px',
                  fontSize: '0.9rem',
                  background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 5px 15px rgba(218, 165, 32, 0.4)',
                  pointerEvents: 'auto',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
             >
               Final Reveal
             </motionDOM.button>
          )}
        </header>

        {/* Dynamic Bottom Controls */}
        <div style={{ alignSelf: 'center', pointerEvents: 'auto', marginTop: 'auto', marginBottom: '6vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AnimatePresence mode="wait">

            {/* 1. Box Closed State */}
            {viewState === 'box' && (
              <motionDOM.button
                key="openbtn"
                exit={{ opacity: 0, y: 20 }}
                onClick={() => setViewState('items')}
                style={{
                  padding: '16px 36px',
                  fontSize: '1.2rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.2)'; e.target.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.transform = 'translateY(0)'; }}
              >
                View Inside
              </motionDOM.button>
            )}

            {/* 2. Interactive Discovery Phase Overlay */}
            {viewState === 'items' && !revealedBox && !pendingRevealBox && (
              <motionDOM.div
                key="guesspanel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ textAlign: 'center', background: 'rgba(0,0,0,0.7)', padding: '20px 40px', borderRadius: '30px', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {!feedbackMsg && !isSandboxMode && targetSequenceIndex < 11 ? (
                  <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>Find the box labeled <br /> <strong style={{ color: '#ffeb3b', fontSize: '1.8rem' }}>Gift {targetSequenceIndex}</strong></p>
                ) : !feedbackMsg && !isSandboxMode && targetSequenceIndex === 11 ? (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 8px 0', fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Only one remains...</p>
                    <strong style={{
                      color: '#ffd700',
                      fontSize: '2.2rem',
                      display: 'block',
                      textShadow: '0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.4)',
                      animation: 'pulse 1.5s ease-in-out infinite alternate'
                    }}>Gift 11 — The Final Secret</strong>
                    <p style={{ color: 'rgba(255,215,0,0.7)', margin: '8px 0 0 0', fontSize: '1rem' }}>Find it to complete the collection!</p>
                  </div>
                ) : !feedbackMsg && isSandboxMode ? (
                  <p style={{ color: '#4ade80', margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>Lorem ipsum dolor sit! Enjoy Free Mode.</p>
                ) : (
                  <h3 style={{ color: feedbackMsg.includes('Oops') ? '#f87171' : '#ffeb3b', margin: 0, fontSize: '1.4rem', fontWeight: 600 }}>{feedbackMsg}</h3>
                )}
              </motionDOM.div>
            )}

            {/* 2.5 PENDING REVEAL (The New "Open Gift" Step) */}
            {viewState === 'items' && !revealedBox && pendingRevealBox && (
              <motionDOM.div
                key="pendingpanel"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'rgba(20,20,20,0.85)',
                  padding: '30px 50px',
                  borderRadius: '25px',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,215,0,0.3)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(255,215,0,0.1)'
                }}
              >
                <motionDOM.button
                  onClick={() => {
                    if (pendingRevealBox === 'Gift5' || pendingRevealBox === 'gift5') {
                        setShowGift5Popup(true);
                    } else {
                        setSelectedRevealGift(pendingRevealBox);
                        setCurrentPage('reveal');
                        setPendingRevealBox(null);
                    }
                  }}
                  style={{
                    padding: '16px 40px',
                    fontSize: '1.4rem',
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.8) 0%, rgba(218,165,32,0.8) 100%)',
                    color: '#1a1a1a',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    boxShadow: '0 10px 30px rgba(255,215,0,0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05) translateY(-2px)';
                    e.target.style.boxShadow = '0 15px 40px rgba(255,215,0,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1) translateY(0)';
                    e.target.style.boxShadow = '0 10px 30px rgba(255,215,0,0.4)';
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  OPEN GIFT
                </motionDOM.button>

                <motionDOM.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    marginTop: '20px',
                    marginBottom: 0,
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.95rem',
                    fontStyle: 'italic',
                    letterSpacing: '0.5px'
                  }}
                >
                  (Lorem ipsum dolor sit amet consectetur)
                </motionDOM.p>
              </motionDOM.div>
            )}

            {/* Fully Revealed Cinematic Info Card (MOVED TO STANDALONE COMPONENT) */}
          </AnimatePresence>
        </div>
      </div>

      {/* The 3D Component Rendering Engine */}
      <div className="canvas-wrapper">
        <Canvas camera={{ position: [0, 5, 15], fov: 45, near: 0.01, far: 1000 }}>
          <color attach="background" args={['#0a0a0a']} />

          <ambientLight intensity={1.5} color="#ffffff" />
          <spotLight position={[10, 20, 10]} intensity={3} penumbra={1} color="#ffebba" castShadow />
          <spotLight position={[-10, 10, -10]} intensity={2.5} color="#88b1ff" />

          <Environment preset="studio" blur={0.8} />

          <Suspense fallback={null}>
            <Bounds fit clip margin={0.8}>
              <Center>
                <group position={[0, 0, 0]}>

                  {/* ANCHOR MESH: Prevents bounds collapse when all others go invisible */}
                  <mesh position={[0, 0, 0]} visible={true}>
                    <boxGeometry args={[0.1, 0.1, 0.1]} />
                    <meshBasicMaterial transparent opacity={0.0} depthWrite={false} />
                  </mesh>

                  <Clone object={oldItemsScene} visible={!showInteractiveItems} />

                  <InteractiveGiftsScene
                    visible={showInteractiveItems}
                    activeGuessBox={activeGuessBox}
                    revealedBox={revealedBox}
                    onBoxClick={handleBoxClick}
                    unlockedGifts={unlockedGifts}
                  />

                  {/* Only render the sinking box if the game has not already been opened before */}
                  {!hasGameStarted && <FadingBox isFading={viewState === 'items'} />}
                </group>
              </Center>
            </Bounds>
          </Suspense>

          <ContactShadows position={[0, -2, 0]} opacity={0.8} scale={25} blur={2.5} far={10} color="#000000" />

          {/* makeDefault is critical — without it Bounds cannot control the camera and models appear tiny! */}
          <OrbitControls
            makeDefault
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2 + 0.05}
            enableZoom={false}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>

        {/* ---------------- SPECIAL GIFT 5 POPUP ---------------- */}
        <AnimatePresence>
          {showGift5Popup && (
            <motionDOM.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
                zIndex: 900, display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}
            >
              <motionDOM.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{
                  background: 'linear-gradient(145deg, #1f2937, #111827)',
                  padding: '50px 40px',
                  borderRadius: '24px',
                  maxWidth: '550px',
                  width: '90%',
                  textAlign: 'center',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255,215,0,0.3)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌟</div>
                <h2 style={{
                  color: '#ffd700',
                  fontSize: '2rem',
                  fontFamily: "'Montserrat', sans-serif",
                  marginBottom: '20px',
                  lineHeight: '1.4'
                }}>
                   Lorem Ipsum Dolor Sit Amet Consectetur
                </h2>
                
                <button
                  onClick={() => {
                    setShowGift5Popup(false);
                    setSelectedRevealGift(pendingRevealBox);
                    setCurrentPage('reveal');
                    setPendingRevealBox(null);
                  }}
                  style={{
                    marginTop: '20px',
                    padding: '15px 40px',
                    fontSize: '1.2rem',
                    background: '#ffd700',
                    color: '#000',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 20px rgba(255,215,0,0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  Confirm & Open Gift
                </button>
              </motionDOM.div>
            </motionDOM.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showFinal && <FinalPremiumPicture onClose={() => setShowFinal(false)} />}
        </AnimatePresence>

    </motionDOM.div>
  );
}

useGLTF.preload('/models/11boxesnew.glb');
useGLTF.preload('/models/11Newgifts.glb');
useGLTF.preload('/models/Boxnew.glb');
