import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ScrollControls,
  useScroll,
  Html,
  OrbitControls,
  Environment,
  ContactShadows,
  BakeShadows,
  useCursor,
  useProgress,
  useGLTF
} from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sun, Moon, Mail, X, Heart } from 'lucide-react';
import './RoomExperience.css';

// 0. Envelope Overlay Component (Premium UI)
function EnvelopeOverlay({ character, onClose, theme }) {
  const [isOpened, setIsOpened] = useState(false);

  // Generate premium dynamic message based on character
  const getMessageData = (char) => {
    if (!char) return { title: "", text: "", img: "" };
    const name = char.toLowerCase();
    if (name.includes('panda')) return { 
        title: "Lorem Ipsum Panda",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
        img: "Temppic1"
    };
    if (name.includes('bunny')) return {
        title: "Dolor Sit Bunny", 
        text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
        img: "Temppic2"
    };
    if (name.includes('happysad')) return {
        title: "Amet Consectetur",
        text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi.",
        img: "Temppic3"
    };
    return {
        title: "A special message just for you.",
        text: "Thank you for exploring!",
        img: ""
    };
  };

  const bgBlurStyle = {
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '100vh',
    zIndex: 999, // very high so it's above everything
    background: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  // Realistic light pinkish red colors
  const envelopeRedLight = 'linear-gradient(135deg, #ffb3b6 0%, #ff8e9b 100%)';
  const envelopeRedDark = 'linear-gradient(135deg, #8a484c 0%, #59292b 100%)';

  return (
    <motion.div
       style={bgBlurStyle}
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       transition={{ duration: 0.5 }}
    >
       <motion.button 
          onClick={onClose} 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ 
            position: 'absolute', 
            top: 30, right: 30, 
            background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', 
            border: 'none',
            borderRadius: '50%',
            width: '50px', height: '50px',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            color: theme === 'dark' ? '#fff' : '#000', 
            cursor: 'pointer',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            zIndex: 10
          }}
       >
          <X size={28} />
       </motion.button>
       
       <div style={{ position: 'relative', width: '85vw', height: '85vh', maxWidth: '800px', maxHeight: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          {/* Message behind the envelope (The Letter) */}
          <motion.div
             style={{
               position: 'absolute',
               width: '100%', height: '100%',
               background: theme === 'dark' ? '#2a2d3e' : '#faf8f2',
               borderRadius: '20px',
               padding: '40px',
               boxShadow: theme === 'dark' ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(0,0,0,0.1)',
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center',
               alignItems: 'center',
               color: theme === 'dark' ? '#e2e8f0' : '#475569',
               fontFamily: "'Montserrat', sans-serif",
               textAlign: 'center',
               border: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
             }}
          >
             {(() => {
                const data = getMessageData(character);
                return (
                   <>
                      {data.img && (
                          <motion.img 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ duration: 0.6, delay: 0.4 }}
                            src={data.img} 
                            alt={data.title} 
                            style={{ 
                               width: '240px', 
                               height: '240px', 
                               objectFit: 'cover', 
                               borderRadius: '20px', // Soft premium square
                               marginBottom: '30px',
                               border: theme === 'dark' ? '8px solid #3f4459' : '8px solid #fff',
                               boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                            }} 
                          />
                      )}
                      <motion.h2 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        style={{ fontSize: '2.2rem', marginBottom: '15px', fontWeight: '800' }}
                      >
                        {data.title}
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                        style={{ fontSize: '1.2rem', fontWeight: '400', opacity: 0.9, maxWidth: '80%', lineHeight: '1.6' }}
                      >
                        {data.text}
                      </motion.p>
                   </>
                )
             })()}
          </motion.div>
          
          {/* Envelope Graphic on top */}
          <AnimatePresence>
            {!isOpened && (
              <motion.div
                  onClick={() => setIsOpened(true)}
                  initial={{ opacity: 1, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // slow, premium fade out
                  style={{
                    position: 'absolute',
                    width: '100%', height: '100%',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: theme === 'dark' ? envelopeRedDark : envelopeRedLight,
                    borderRadius: '20px',
                    boxShadow: theme === 'dark' ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(255,142,155,0.4)',
                    flexDirection: 'column',
                    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.6)',
                  }}
              >
                  <Mail size={100} color={theme === 'dark' ? '#ffccd0' : '#fff'} style={{ opacity: 0.9, filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.1))' }} />
                  <p style={{ marginTop: '30px', color: theme === 'dark' ? '#ffccd0' : '#fff', fontSize: '1.4rem', fontFamily: "'Montserrat', sans-serif", letterSpacing: '2px', fontWeight: '500', opacity: 0.9, textShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    TAP TO OPEN
                  </p>
                  
                  {/* Decorative envelope flaps */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '50%',
                    background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.15)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%',
                    background: theme === 'dark' ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.03)',
                    clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                    borderBottomLeftRadius: '20px',
                    borderBottomRightRadius: '20px',
                  }} />
              </motion.div>
            )}
           </AnimatePresence>
       </div>
    </motion.div>
  );
}

// 0.5 Notice Board Overlay Component
function NoticeBoard({ onClose, theme }) {
  const bgBlurStyle = {
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '100vh',
    zIndex: 950, // Below envelope but above room
    background: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <motion.div
       style={bgBlurStyle}
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       transition={{ duration: 0.5 }}
    >
       <motion.div
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            position: 'relative',
            width: '90vw', 
            maxWidth: '650px', // Enlarged
            maxHeight: '85vh',
            overflowY: 'auto', // Allow scroll if text gets too big
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderRadius: '24px',
            padding: '50px 40px',
            boxShadow: theme === 'dark' ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)' : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
       >
         {/* Push Pin Decorative Header */}
         <div style={{ position: 'absolute', top: '15px', width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)' }} />

         <h2 style={{
           fontFamily: "'Montserrat', sans-serif",
           fontSize: '2rem',
           fontWeight: '700',
           color: theme === 'dark' ? '#f3f4f6' : '#111827',
           margin: '10px 0 25px 0',
           letterSpacing: '1px',
           textTransform: 'uppercase'
         }}>
           Notice
         </h2>

         <ul style={{
           margin: 0,
           padding: '0 0 0 20px',
           color: theme === 'dark' ? '#d1d5db' : '#4b5563',
           fontFamily: "'Montserrat', sans-serif",
           fontSize: '1.1rem',
           lineHeight: '1.8',
           width: '100%'
         }}>
            <li style={{ marginBottom: '15px' }}>Welcome to the 3D Room Experience!</li>
            <li style={{ marginBottom: '15px' }}>Explore the room by clicking and dragging to rotate your view.</li>
            <li style={{ marginBottom: '15px' }}>Click on the Laptop Screen or Picture Frame to zoom in for a closer look (use the '✕' at the bottom to zoom out).</li>
            <li style={{ marginBottom: '15px' }}>Click on the characters (Bunny, Panda, Happysad) to read special messages.</li>
            <li style={{ marginBottom: '15px' }}>Toggle between Day and Night modes using the switch in the top-right corner.</li>
            <li style={{ marginBottom: '15px' }}><strong>Main Objective:</strong> Click the Giftbox on the bed to start your virtual unboxing journey!</li>
            <li>Enjoy discovering all the little secrets hidden within this room.</li>
         </ul>

         <motion.button 
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              marginTop: '40px',
              padding: '12px 30px',
              background: theme === 'dark' ? '#3b82f6' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)'
            }}
         >
            Got it!
         </motion.button>
       </motion.div>
    </motion.div>
  );
}

// Pre-load the 6MB room to avoid staggering pop-in
useGLTF.preload('/models/Newroom.glb');

// 1. Loading Overlay Component (Now bound to actual GLTF loading progress!)
function LoadingScreen({ progress, theme }) {
  // Ensure we smoothly show digits
  const displayProgress = Math.min(100, Math.round(progress));

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: theme === 'dark' ? '#1f1f1f' : '#f6f3eb',
        zIndex: 50,
        color: theme === 'dark' ? '#888' : '#aaa',
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '1.5rem',
        fontWeight: '300'
      }}
    >
      <div style={{ position: 'relative', width: '200px', height: '2px', background: theme === 'dark' ? '#333' : '#e0e0e0', marginTop: '20px' }}>
        <motion.div
          style={{ height: '100%', background: theme === 'dark' ? '#888' : '#888' }}
          initial={{ width: '0%' }}
          animate={{ width: `${displayProgress}%` }}
        />
      </div>
      <div style={{ marginTop: '10px', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
        {displayProgress === 100 ? "Ready" : `${displayProgress}%`}
      </div>
    </motion.div>
  );
}

// 2. The Small Intro Cube (Bokoko Style Animation)
function IntroGiftBox({ onStart, theme, isLocked, isLoaded, portal }) {
  const groupRef = useRef();
  const boxMeshRef = useRef();
  const textRef = useRef();
  const scroll = useScroll();
  const [startAnim, setStartAnim] = useState(false);
  const animProgress = useRef(0);

  // Trigger entrance animations EXACTLY when loading finishes, preventing broken timings
  useEffect(() => {
    if (isLoaded) {
      const t = setTimeout(() => setStartAnim(true), 1000);
      return () => clearTimeout(t);
    }
  }, [isLoaded]);

  useFrame((state, delta) => {
    // 1. Hide entirely if locked
    if (isLocked) {
      if (groupRef.current) groupRef.current.visible = false;
      if (textRef.current) textRef.current.style.opacity = 0;
      return;
    }

    if (startAnim) {
      animProgress.current = THREE.MathUtils.lerp(animProgress.current, 1, 4 * delta);
    }

    // 2. Scroll fade out exact interpolation
    const fadeOut = Math.max(0, Math.min(1, 1 - scroll.range(0, 0.25)));
    if (boxMeshRef.current) {
      boxMeshRef.current.scale.setScalar(fadeOut);
      boxMeshRef.current.visible = fadeOut > 0;
    }

    if (textRef.current) {
      const finalOpacity = Math.min(animProgress.current, fadeOut);
      textRef.current.style.opacity = finalOpacity;
      // Fixed static position mapping so it just fades in place instead of moving up and down
      textRef.current.style.transform = `translate3d(0, 0px, 0)`;
    }

    // 3. Bokoko Physical Flow: Cube stays neatly centered, floats up slightly and spins smoothly
    if (startAnim && boxMeshRef.current) {
      // Float up gently
      boxMeshRef.current.position.y = THREE.MathUtils.lerp(boxMeshRef.current.position.y, 0.4, 2.0 * delta);
      // Spin to look dynamic
      boxMeshRef.current.rotation.y += 0.8 * delta;
      boxMeshRef.current.rotation.x += 0.4 * delta;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Starting exactly at 0,0,0, floats up during animation */}
      <mesh
        ref={boxMeshRef}
        rotation={[Math.PI / 4, Math.PI / 4, 0]}
        position={[0, 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#ffc0cb" />
      </mesh>

      {/* The Text perfectly centered beneath the box */}
      <Html position={[0, -0.8, 0]} center portal={portal}>
        <div
          ref={textRef}
          style={{
            opacity: 0,
            transform: 'translate3d(0, 0px, 0)',
            width: 'max-content',
            fontSize: '1.2rem',
            color: theme === 'dark' ? '#ececec' : '#4a4a4a',
            fontWeight: '500',
            fontFamily: "'Montserrat', sans-serif",
            whiteSpace: 'nowrap',
            letterSpacing: '0.05em',
            pointerEvents: 'none'
          }}
        >
          Scroll down to view more
        </div>
      </Html>
    </group>
  );
}

// 3. The New Room (Replaces Placeholder, Features Dynamic Post-processing and Lighting)
function DynamicRoomModel({ onStart, theme, isLocked, setIsLocked, setZoomTarget, doorPos, setActiveEnvelope }) {
  const roomRef = useRef();
  const scroll = useScroll();
  const { scene } = useGLTF('./models/Newroom.glb');
  const [lightsConfigured, setLightsConfigured] = useState(false);

  // ONE-TIME initialization to prevent massive lag during theme swaps!
  useEffect(() => {
    if (lightsConfigured) return;

    scene.updateMatrixWorld(true);

    scene.traverse((node) => {
      if (node.isMesh) {

        node.castShadow = true;
        node.receiveShadow = true;

        if (node.name.toLowerCase().includes('bulb') || node.name.toLowerCase().includes('tubelight') || node.name.toLowerCase().includes('lights1002')) {
          node.castShadow = false;
          node.receiveShadow = false;

          if (!node.userData.clonedMat) {
            node.material = node.material.clone();
            node.material.toneMapped = false; // Set once to prevent shader-recompile lag on theme swap
            node.userData.clonedMat = true;
          }

          // TARGET ALL 'BULB143' LAMPS
          if (node.name.toLowerCase().includes('bulb143')) {
            if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
            const center = new THREE.Vector3();
            node.geometry.boundingBox.getCenter(center);

            // Only apply position shift ONCE to push the frame towards the left/door area


            // ADD A WARM POINT LIGHT TO WASH THE DOOR AND THE SHELF (BUNNY, PANDA)
              if (!node.userData.attachedLight) {
                const color = new THREE.Color("#ffbe55"); // Premium warm glow
                const intensity = 0;
                const distance = 12; // Reach a bit further smoothly
                const light = new THREE.PointLight(color, intensity, distance);

                light.decay = 2;
                light.castShadow = false;
                light.position.copy(center);
                light.position.y -= 0.3;
                light.position.z += 0.2;

                node.add(light);
                node.userData.attachedLight = light;
              }
            node.userData.isBulb143 = true;
          }

          // PREMIUM NIGHT TUBE LIGHT — BULB144 / TUBELIGHT / LIGHTS1002
          if (node.name.toLowerCase().includes('bulb144') || node.name.toLowerCase().includes('tubelight') || node.name.toLowerCase().includes('lights1002')) {
            node.userData.isBulb144 = true;
          }

          // FAIRY LIGHTS — BULBS1004
          if (node.name.toLowerCase().includes('bulbs1004')) {
            node.userData.isFairyLight = true;
          }
        }
      }
    });
    setLightsConfigured(true);
  }, [scene, lightsConfigured]);

  // Fast theme toggling! Only change intensities, no structural changes.
  useEffect(() => {
    if (!lightsConfigured) return;

    scene.traverse((node) => {
      // Catch all lights including new naming conventions
      if (node.isMesh && (node.name.toLowerCase().includes('bulb') || node.name.toLowerCase().includes('tubelight') || node.name.toLowerCase().includes('lights1002'))) {
        if (node.userData.isBulb143) {
          if (node.userData.attachedLight) {
            node.userData.attachedLight.intensity = (theme === 'dark') ? 1.0 : 0; // Smooth, premium wash
          }
          if (theme === 'dark') {
            node.material.emissive = new THREE.Color('#ffbe55');
            node.material.emissiveIntensity = 1.5; // Smoother, less harsh glow
          } else {
            node.material.emissiveIntensity = 0;
          }
        }

        if (node.userData.isBulb144) {
          if (theme === 'dark') {
            node.material.emissive = new THREE.Color('#ffffff');
            node.material.emissiveIntensity = 4.0; // Higher glow for the tube light itself, relies purely on bloom now for premium look!
          } else {
            node.material.emissiveIntensity = 0;
          }
        }

        if (node.userData.isFairyLight) {
          if (theme === 'dark') {
            node.material.emissive = new THREE.Color('#ffcc88');
            node.material.emissiveIntensity = 2.0;
          } else {
            node.material.emissiveIntensity = 0;
          }
        }
      }
    });
  }, [scene, theme, lightsConfigured]);

  useFrame(() => {
    // If already locked, always stay fully scaled up
    if (isLocked) {
      if (roomRef.current) roomRef.current.scale.setScalar(1);
      return;
    }

    // Start appearing exactly when the cube disappears (from 25% to 60% scroll)
    const popIn = scroll.range(0.25, 0.6);
    if (roomRef.current) {
      roomRef.current.scale.setScalar(popIn);
    }

    // --- THE ONE WAY SCROLL LOCK ---
    // If the user reaches the end of the scroll, lock it forever!
    if (scroll.offset > 0.95 && !isLocked) {
      setIsLocked(true);
      scroll.el.style.overflowY = 'hidden';
      // Force scroll to exact bottom just in case
      scroll.el.scrollTop = scroll.el.scrollHeight;
    }
  });

  // Dynamic interactive click checking layer
  const handlePointerOver = (e) => {
    const name = e.object.name.toLowerCase();
    if (name.includes('gift') || name.includes('screen') || name.includes('mac') || name.includes('laptop') || name.includes('frame') || name.includes('pic') || name.includes('panda') || name.includes('bunny') || name.includes('happysad')) {
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = (e) => {
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const name = e.object.name.toLowerCase();

    if (name.includes('gift')) {
      onStart();
    } else if (name.includes('panda') || name.includes('bunny') || name.includes('happysad')) {
      // Trigger new Envelope Logic
      setActiveEnvelope(name);
    } else if (name.includes('screen') || name.includes('mac') || name.includes('laptop')) {
      // The laptop is on the desk along the -X wall, which means the screen inherently faces +X!
      const point = e.point;
      setZoomTarget({
        target: new THREE.Vector3(point.x, point.y, point.z),
        cameraPos: new THREE.Vector3(point.x + 1.2, point.y + 0.15, point.z), // Directly in front (+X) of the screen!
        isZoomedIn: true
      });
      if (!isLocked) setIsLocked(true);
    } else if (name.includes('frame') || name.includes('pic')) {
      // Dynamic Normal-based Zooming for the picture frame
      const point = e.point;
      let normalOffset = new THREE.Vector3(0, 0, 1.5);
      if (e.object && e.face) {
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(e.object.matrixWorld);
        normalOffset = e.face.normal.clone().applyMatrix3(normalMatrix).normalize().multiplyScalar(1.3);

        if (Math.abs(normalOffset.y) < 0.1) {
          normalOffset.y += 0.1;
        }
      }

      setZoomTarget({
        target: new THREE.Vector3(point.x, point.y, point.z),
        cameraPos: new THREE.Vector3(point.x, point.y, point.z).add(normalOffset),
        isZoomedIn: true
      });
    }
  };

  return (
    <group ref={roomRef} position={[0, -1.0, 0]}>
      {/* Custom explicit lighting for the Door Area (Since its bulb geometry got baked non-emissive into the scene) */}
      <group position={doorPos}>
        <pointLight 
          color="#ffbe55" 
          intensity={theme === 'dark' ? 1.5 : 0} 
          distance={15} 
          decay={1.2} /* Lowered decay for a smoother, less circular/harsh wash over the geometry */
          castShadow={false} 
        />
        {/* Removed the fake sphere geometry to prevent the harsh 'circle' artifact from appearing */}
      </group>

      <primitive
        object={scene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
    </group>
  );
}

// 4. Smooth Camera Rig for dynamic zooming
function CameraControlsRig({ zoomTarget, isLocked }) {
  const { camera, controls } = useThree();

  useFrame((state, delta) => {
    // Smoothly animate camera and orbit target without fighting restrictions
    if (controls) {
      if (zoomTarget && isLocked) {
        // Temporarily open bounds so the lerp has free movement mathematically
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI;
        controls.minAzimuthAngle = -Infinity;
        controls.maxAzimuthAngle = Infinity;
        controls.minDistance = 0.1;

        controls.target.lerp(zoomTarget.target, 5 * delta);
        camera.position.lerp(zoomTarget.cameraPos, 5 * delta);
        // CRITICAL: We MUST call controls.update() so it natively calculates the camera 'lookAt' rotation smoothly!
        controls.update();
      } else {
        // Restore OrbitControls default room viewing constraints
        controls.minPolarAngle = Math.PI / 4;
        controls.maxPolarAngle = Math.PI / 2.2;
        controls.minAzimuthAngle = Math.PI / 8;
        controls.maxAzimuthAngle = 3 * Math.PI / 8;
        controls.minDistance = 4;
        controls.maxDistance = 15; // Specifically locks it from zooming out completely causing the "making it small" bug
        controls.update();
      }
    }
  });

  return (
    <OrbitControls
      makeDefault
      target={[0, 0, 0]}
      enableZoom={isLocked}
      enablePan={false}
    />
  );
}

export default function RoomExperience({ onStart }) {
  const [theme, setTheme] = useState('light');
  const [isLocked, setIsLocked] = useState(false);
  const [zoomTarget, setZoomTarget] = useState(null);
  const [activeEnvelope, setActiveEnvelope] = useState(null);
  const [showNotice, setShowNotice] = useState(false);
  const [hasSeenNotice, setHasSeenNotice] = useState(false);

  // Trigger notice board automatically upon room entering "locked" state
  useEffect(() => {
    if (isLocked && !hasSeenNotice) {
      setShowNotice(true);
      setHasSeenNotice(true);
    }
  }, [isLocked, hasSeenNotice]);

  // Exact Door Lamp position derived from testing
  const doorPos = [-1.73, 2.32, 1.4];

  const containerRef = useRef();

  // Real 3D Asset Loading State!
  const { progress } = useProgress();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only unlock the loading screen once R3F confirms the heavy GLTF is literally 100% in memory
    if (progress === 100) {
      const timer = setTimeout(() => setIsLoaded(true), 600); // Linger on 100% to let textures compile into VRAM
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const bgColor = theme === 'dark' ? '#1f1f1f' : '#f6f3eb'; // Deep premium dark mode / cream light mode

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', background: bgColor, position: 'relative', transition: 'background 0.5s ease', overflow: 'hidden' }}>


      <AnimatePresence>
        {!isLoaded && <LoadingScreen progress={progress} theme={theme} />}
      </AnimatePresence>

      {/* --- THEME TOGGLE OVERLAY --- */}
      <div style={{
        position: 'absolute',
        top: '30px',
        right: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        zIndex: 10,
        background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        padding: '8px 16px',
        borderRadius: '30px',
        backdropFilter: 'blur(10px)'
      }}>
        <Sun size={20} color={theme === 'dark' ? '#888' : '#eab308'} style={{ cursor: 'pointer' }} onClick={() => setTheme('light')} />

        {/* Toggle Pill */}
        <div
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{
            width: '44px',
            height: '24px',
            background: theme === 'dark' ? '#4a4a4a' : '#ddd',
            borderRadius: '12px',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.3s ease'
          }}
        >
          <motion.div
            style={{
              width: '20px',
              height: '20px',
              background: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: '2px'
            }}
            initial={false}
            animate={{ left: theme === 'dark' ? '22px' : '2px' }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>

        <Moon size={20} color={theme === 'dark' ? '#818cf8' : '#888'} style={{ cursor: 'pointer' }} onClick={() => setTheme('dark')} />
      </div>

      <Canvas shadows dpr={[1, 2]} camera={{ position: [8, 6, 8], fov: 35 }}>
        <color attach="background" args={[theme === 'dark' ? '#252836' : bgColor]} />

        {/* Cinematic Lighting Rig - Rich Twilight Blue Contrast in Dark Mode */}
        <ambientLight
          color={theme === 'dark' ? '#4a5b7c' : '#ffffff'}
          intensity={theme === 'dark' ? 0.25 : 0.4}
        />

        {/* The "Sun" */}
        <directionalLight
          position={[8, 20, 8]}
          intensity={theme === 'dark' ? 0.1 : 2.0}  /* Sun dims hugely at night to let the lamps pop */
          castShadow
          shadow-bias={-0.0005}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
        />

        {/* The true reason Night mode looked like daytime! The Environment HDR lighting was active during night. Removing it makes it perfectly dark. */}
        {theme === 'light' && <Environment preset="apartment" blur={0.8} />}



        {/* --- SCROLL MECHANISM --- */}
        {/* DO NOT use a dynamic pages ternary here as it causes a full unmount/remount lag! */}
        <ScrollControls pages={2} damping={0.25} distance={1.5}>

          <IntroGiftBox onStart={onStart} theme={theme} isLocked={isLocked} isLoaded={isLoaded} portal={containerRef} />

          {/* We mount this immediately so shaders compile securely during the loading screen, preventing page freezes! */}
          <DynamicRoomModel
          onStart={onStart}
          theme={theme}
          isLocked={isLocked}
          setIsLocked={setIsLocked}
          setZoomTarget={setZoomTarget}
          doorPos={doorPos}
          setActiveEnvelope={setActiveEnvelope}
        />

        </ScrollControls>

        {/* --- POST PROCESSING GLOW LAYER --- */}
        <EffectComposer disableNormalPass>
          {/* Minimal static bloom avoids freezing pipeline on theme swaps */}
          <Bloom luminanceThreshold={0.9} mipmapBlur intensity={theme === 'dark' ? 0.8 : 0.05} radius={0.6} />
        </EffectComposer>

        {/* Unified Ground Shadow Matrix */}
        <ContactShadows position={[0, -1.0, 0]} opacity={0.5} scale={25} blur={2.5} far={4} resolution={256} color="#000000" />

        {/* Dynamic camera rig that handles OrbitControls and zooming into laptop */}
        <CameraControlsRig zoomTarget={zoomTarget} isLocked={isLocked} />
      </Canvas>

      {/* Unzoom / Close Button Overlay */}
      <AnimatePresence>
        {zoomTarget?.isZoomedIn && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              color: theme === 'dark' ? '#fff' : '#4a4a4a',
              fontFamily: 'sans-serif',
              fontWeight: '400',
              fontSize: '22px',
              lineHeight: '1',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => {
              // Send camera back to default room view smoothly
              setZoomTarget({
                target: new THREE.Vector3(0, 0, 0),
                cameraPos: new THREE.Vector3(8, 6, 8),
                isZoomedIn: false
              });
              // After travel finishes, release the lerp lock so user can manually rotate again
              setTimeout(() => setZoomTarget(null), 1000);
            }}
          >
            ✕
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouncing Scroll Down UI overlay (Hide when loaded or locked) */}
      <AnimatePresence>
        {isLoaded && !isLocked && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: theme === 'dark' ? '#888' : '#888',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'none'
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ delay: 0.5, duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            <ChevronDown size={32} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ENVELOPE POPUP OVERLAY --- */}
      <AnimatePresence>
        {activeEnvelope && (
          <EnvelopeOverlay 
            character={activeEnvelope} 
            theme={theme} 
            onClose={() => setActiveEnvelope(null)} 
          />
        )}
      </AnimatePresence>

      {/* --- NOTICE BOARD POPUP --- */}
      <AnimatePresence>
        {showNotice && (
          <NoticeBoard 
            theme={theme} 
            onClose={() => setShowNotice(false)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
