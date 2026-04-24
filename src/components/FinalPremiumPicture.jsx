import React from 'react';
import { motion } from 'framer-motion';

export default function FinalPremiumPicture({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(30px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999999,
        background: 'rgba(10, 10, 10, 0.92)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontFamily: "'Montserrat', sans-serif"
      }}
    >
      <motion.div
        initial={{ y: 50, scale: 0.8, opacity: 0, rotateX: 10 }}
        animate={{ y: 0, scale: 1, opacity: 1, rotateX: 0 }}
        transition={{ delay: 0.5, duration: 1.5, type: 'spring', damping: 25, stiffness: 80 }}
        style={{
          position: 'relative',
          padding: '15px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
          borderRadius: '24px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.9), 0 0 50px rgba(255, 215, 0, 0.15)',
          border: '1px solid rgba(255,215,0,0.3)',
          perspective: '1000px'
        }}
      >
        <img 
          src="./models/Thanks.jpg" 
          alt="Thank You" 
          style={{
            maxWidth: '90vw',
            maxHeight: '65vh',
            borderRadius: '16px',
            objectFit: 'cover',
            display: 'block',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
          }} 
        />
        
        {/* Subtle premium reflections & overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: '24px',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
          background: 'linear-gradient(to bottom right, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1.2 }}
        style={{
          marginTop: '50px',
          textAlign: 'center'
        }}
      >
        <h2 style={{ 
          margin: 0, 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
          fontWeight: '300',
          letterSpacing: '8px',
          color: '#ffd700',
          textShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
          textTransform: 'uppercase'
        }}>
          Thank You
        </h2>
        <p style={{
          marginTop: '15px',
          fontSize: '1rem',
          letterSpacing: '4px',
          opacity: 0.6,
          textTransform: 'uppercase',
          fontWeight: '400'
        }}>
          Visit again
        </p>
      </motion.div>

      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '40px',
          right: '50px',
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '1.2rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          padding: '10px',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
      >
        ✕ Close
      </button>

      {/* Decorative ambient light spheres */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: -1
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(255,105,180,0.15) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: -1
        }}
      />
    </motion.div>
  );
}
