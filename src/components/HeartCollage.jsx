import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FinalPremiumPicture from './FinalPremiumPicture';
import './HeartCollage.css';

export default function HeartCollage({ photos, onDownload }) {
  const [showFinal, setShowFinal] = React.useState(false);

  // Convert object of photos {Gift1: base64, Gift2: base64...} into an array of 11 items.
  // If a photo wasn't taken for a specific gift, we leave a placeholder.
  const photoArray = Array.from({ length: 11 }, (_, i) => {
    const key = `Gift${i + 1}`;
    return photos[key] || null;
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="collage-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50
      }}
    >
      <div className="collage-header">
        <h1 className="collage-title">Memories</h1>
        <p className="collage-subtitle">11 Gifts, 11 Beautiful Memories.</p>
      </div>

      <div className="heart-grid-wrapper" id="capture-area">
        <div className="heart-grid">
          {photoArray.map((src, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="heart-grid-item"
              >
                {src ? (
                  <img src={src} alt={`Memory ${index + 1}`} className="collage-img" />
                ) : (
                  <div className="collage-placeholder">
                    <span>{index + 1}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="collage-footer">
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
          <button className="download-btn" onClick={onDownload}>
            📥 Save This Memory Frame
          </button>
          
          <button 
            onClick={() => setShowFinal(true)}
            style={{
              padding: '12px 30px',
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
              color: '#000',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 8px 15px rgba(218, 165, 32, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Final Reveal
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFinal && <FinalPremiumPicture onClose={() => setShowFinal(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}
