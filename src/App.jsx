import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Bounds, Center } from '@react-three/drei';
import { GiftBox } from './components/GiftBox';
import { Overlay } from './components/Overlay';
import { GiftsPage } from './components/GiftsPage';
import GiftRevealStandalone from './components/GiftRevealStandalone';
import RoomExperience from './components/RoomExperience';
import HeartCollage from './components/HeartCollage';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';

// --- TEMPORARY COUNTDOWN COMPONENT ---
function CountdownOverlay({ timeLeft }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: '#1a1b26',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      color: '#fff', fontFamily: "'Montserrat', sans-serif", zIndex: 99999
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '15px', letterSpacing: '4px', textTransform: 'uppercase', color: '#ffb3b6', textAlign: 'center' }}>
        Something Special is Coming...
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '50px', opacity: 0.8, textAlign: 'center', maxWidth: '600px', lineHeight: '1.6', padding: '0 20px' }}>
        The virtual doors are almost open. Get ready for a journey of discovery, surprises, and beautiful memories. Stay tuned!
      </p>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
         {Object.entries(timeLeft).map(([unit, value]) => (
           <div key={unit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <div style={{
               width: '90px', height: '90px', background: 'rgba(255,255,255,0.03)',
               borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center',
               fontSize: '2.5rem', fontWeight: 'bold', border: '1px solid rgba(255,179,182,0.2)',
               boxShadow: '0 10px 30px rgba(0,0,0,0.3)', color: '#ffb3b6'
             }}>
               {value.toString().padStart(2, '0')}
             </div>
             <span style={{ marginTop: '12px', fontSize: '0.9rem', textTransform: 'uppercase', opacity: 0.6, letterSpacing: '2px' }}>
               {unit}
             </span>
           </div>
         ))}
      </div>
    </div>
  );
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  // Default to the new 3D Room Experience
  const [currentPage, setCurrentPage] = useState('room-experience');

  // Lifted Game Sequence State to survive React remounting when isolating 3D contexts
  const [targetSequenceIndex, setTargetSequenceIndex] = useState(1);
  const [unlockedGifts, setUnlockedGifts] = useState([]);
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [selectedRevealGift, setSelectedRevealGift] = useState(null);
  
  // Web capture bypass state
  const [isCaptureBypassed, setIsCaptureBypassed] = useState(false);
  
  // Persistent Memories State
  const [capturedPhotos, setCapturedPhotos] = useState({});

  useEffect(() => {
    // Clear any previously saved memory to ensure fresh start on refresh
    localStorage.removeItem('gravityy-memories');
  }, []);
  
  // --- TEMPORARY COUNTDOWN LOGIC ---
  const TARGET_DATE = new Date('2026-04-24T19:11:00'); // Set to current time to open the experience
  const calculateTimeLeft = () => {
    const difference = TARGET_DATE - new Date();
    if (difference <= 0) return null;
    return {
      Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      Minutes: Math.floor((difference / 1000 / 60) % 60),
      Seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!timeLeft) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // --- END COUNTDOWN LOGIC ---

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize(); // Check initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartLanding = () => {
    setCurrentPage('landing');
  };

  // 1. If time is remaining, block everything (must be placed after ALL hooks!).
  if (timeLeft) {
    return <CountdownOverlay timeLeft={timeLeft} />;
  }

  if (isMobile) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#1a1b26',
        color: '#fff',
        textAlign: 'center',
        padding: '30px',
        fontFamily: "'Montserrat', sans-serif"
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px', color: '#ffb3b6' }}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>Desktop Only</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.8, maxWidth: '400px' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">

      {currentPage === 'room-experience' && (
        <motion.div
           key="room-experience"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0, filter: 'blur(10px)' }}
           transition={{ duration: 0.8 }}
           style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}
        >
           <RoomExperience onStart={handleStartLanding} />
        </motion.div>
      )}

      {currentPage === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}
        >
          <Overlay isOpen={isOpen} setIsOpen={setIsOpen} setCurrentPage={setCurrentPage} />

          <div className="canvas-wrapper">
            <Canvas camera={{ position: [0, 5, 15], fov: 45 }}>
              <color attach="background" args={['#0a0a0a']} />

              <ambientLight intensity={1.5} color="#ffffff" />
              <spotLight position={[10, 20, 10]} intensity={3} penumbra={1} color="#ffebba" castShadow />
              <spotLight position={[-10, 10, -10]} intensity={2.5} color="#88b1ff" />

              <Environment preset="studio" blur={0.8} />

              <Suspense fallback={null}>
                <Bounds fit clip margin={1.5}>
                  <Center>
                    <GiftBox isOpen={isOpen} setIsOpen={setIsOpen} />
                  </Center>
                </Bounds>
              </Suspense>

              <ContactShadows position={[0, -2, 0]} opacity={0.8} scale={25} blur={2.5} far={10} color="#000000" />

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
        </motion.div>
      )}

      {currentPage === 'gifts' && (
        <GiftsPage
          key="gifts"
          setCurrentPage={setCurrentPage}
          setIsOpen={setIsOpen}
          targetSequenceIndex={targetSequenceIndex}
          setTargetSequenceIndex={setTargetSequenceIndex}
          unlockedGifts={unlockedGifts}
          setUnlockedGifts={setUnlockedGifts}
          isSandboxMode={isSandboxMode}
          setIsSandboxMode={setIsSandboxMode}
          setSelectedRevealGift={setSelectedRevealGift}
        />
      )}

      {currentPage === 'reveal' && selectedRevealGift && (
        <React.Suspense fallback={null}>
          <GiftRevealStandalone
            key="reveal-standalone"
            giftId={selectedRevealGift}
            isLastGift={selectedRevealGift === 'Gift11'}
            onClose={(goToCollage) => {
              // Determine progression BEFORE exiting
              if (!isSandboxMode) {
                if (targetSequenceIndex === 11) {
                  setIsSandboxMode(true);
                  // Don't clear unlockedGifts so they stay open in Sandbox!
                } else {
                  setUnlockedGifts(prev => [...prev, selectedRevealGift]);
                  setTargetSequenceIndex(prev => prev + 1);
                }
              }

              // Navigate to collage ONLY if it was the 11th gift AND a photo was captured
              if (targetSequenceIndex === 11 && !isSandboxMode && goToCollage) {
                 setCurrentPage('collage');
              } else {
                 setCurrentPage('gifts');
              }
              setSelectedRevealGift(null);
            }}
            isCaptureBypassed={isCaptureBypassed}
            onBypassCapture={() => setIsCaptureBypassed(true)}
            onSaveMemory={(giftId, base64Image) => {
              setCapturedPhotos(prev => ({ ...prev, [giftId]: base64Image }));
            }}
          />
        </React.Suspense>
      )}

      {currentPage === 'collage' && (
        <HeartCollage 
          key="collage" 
          photos={capturedPhotos} 
          onDownload={() => window.print()}
        />
      )}
    </AnimatePresence>
  );
}

