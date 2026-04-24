import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- NOTICE BOARD COMPONENT FOR OVERLAY ---
function NoticeBoard({ onClose }) {
  const bgBlurStyle = {
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '100vh',
    zIndex: 950, 
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'auto'
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
            width: '95vw', 
            maxWidth: '850px', // Wider to prevent aggressive text wrapping
            maxHeight: '95vh', // Taller to fit all 11 points
            overflowY: 'auto',
            background: '#1f2937',
            borderRadius: '24px',
            padding: '35px 30px', // Slightly reduced padding to maximize space
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
       >
         <div style={{ position: 'absolute', top: '15px', width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)' }} />

         <h2 style={{
           fontFamily: "'Montserrat', sans-serif",
           fontSize: '1.8rem',
           fontWeight: '700',
           color: '#f3f4f6',
           margin: '10px 0 25px 0',
           letterSpacing: '1px',
           textTransform: 'uppercase',
           textAlign: 'center'
         }}>
           Important Guidelines
         </h2>

         <ul style={{
           margin: 0,
           padding: '0 0 0 20px',
           color: '#d1d5db',
           fontFamily: "'Montserrat', sans-serif",
           fontSize: '1rem', // Slightly smaller text to fit all beautifully
           lineHeight: '1.6',
           width: '100%'
         }}>
           <li style={{ marginBottom: '10px' }}><strong>Sequential Discovery:</strong> Find the gifts in order (starting with Gift 1). Look for the matching box in the 3D gallery to unlock it.</li>
           <li style={{ marginBottom: '10px' }}><strong>Click Precision:</strong> Some boxes can be tricky! If a gift doesn't click immediately, try rotating the camera and clicking from a different angle.</li>
           <li style={{ marginBottom: '10px' }}><strong>Virtual meets Real:</strong> When you unlock a virtual gift, open your corresponding real-life gift at the same time for the ultimate experience!</li>
           <li style={{ marginBottom: '10px' }}><strong>Interactive Inspection:</strong> Once a gift is revealed, you can freely rotate and zoom in to see every detail of the 3D model.</li>
           <li style={{ marginBottom: '10px' }}><strong>Capture vs. Return:</strong> "Capture Moment" saves your photo to the heart collage, while "Return to Gallery" skips the capture and takes you back to the collection.</li>
           <li style={{ marginBottom: '10px' }}><strong>The Heart Collage:</strong> Every photo you capture will be automatically placed into a beautiful heart-shaped collage at the end.</li>
           <li style={{ marginBottom: '10px' }}><strong>Sandbox Mode:</strong> Once you've found all 11 gifts, you can revisit any of them whenever you like in Free Mode.</li>
           <li><strong>Need Help?</strong> If you get stuck or have questions, just reach out! I'm here to guide you through your special day.</li>
         </ul>

         <motion.button 
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              marginTop: '40px',
              padding: '12px 30px',
              background: '#3b82f6',
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

export function Overlay({ isOpen, setIsOpen, setCurrentPage }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showNotice, setShowNotice] = useState(true); // Show automatically on load!

  const handleOpenClick = () => {
    if (isTransitioning) return;
    
    if (!isOpen) {
      setIsOpen(true);
      setIsTransitioning(true);
      // Wait for lid/tilt animation, then switch route
      setTimeout(() => {
        setCurrentPage('gifts');
        setIsTransitioning(false);
      }, 1500);
    } else {
      // Box already open
      setCurrentPage('gifts');
    }
  };

  return (
    <>
    <AnimatePresence>
      {showNotice && <NoticeBoard onClose={() => setShowNotice(false)} />}
    </AnimatePresence>

    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '40px',
      zIndex: 10,
    }}>
      <header style={{
        textAlign: 'center',
        marginTop: '2vh'
      }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
          fontWeight: 800, 
          margin: 0, 
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          letterSpacing: '-1px'
        }}>
          Discover the Premium Experience
        </h1>
        <p style={{ 
          color: 'rgba(255,255,255,0.7)', 
          fontSize: '1.2rem', 
          marginTop: '10px',
          fontWeight: 300
        }}>
          Lorem ipsum dolor sit amet consectetur
        </p>
      </header>

      <div style={{ alignSelf: 'center', pointerEvents: 'auto', marginTop: 'auto', marginBottom: '6vh' }}>
        <button
          onClick={handleOpenClick}
          disabled={isTransitioning}
          style={{
            padding: '16px 36px',
            fontSize: '1.2rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50px',
            cursor: isTransitioning ? 'wait' : 'pointer',
            fontWeight: '600',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            opacity: isTransitioning ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isTransitioning) {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
             if (!isTransitioning) {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.transform = 'translateY(0)';
             }
          }}
        >
          {isTransitioning ? "Unveiling..." : (isOpen ? "View Gifts" : "Open the Box")}
        </button>
      </div>
    </div>
    </>
  );
}
