import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

// Replace string with user's specific Apps Script Web App URL!
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwkTKrOpXeNDGQxz7AarxNjzl3JAPPqyb0piZOqUnqNCxk9QLGr0fkkG2T9Io90L94JhA/exec";

export default function WebcamCapture({ onCapture, onCancel, currentGift }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showFlash, setShowFlash] = useState(false);
  const [isUploadedPhoto, setIsUploadedPhoto] = useState(false);

  // Initialize camera
  useEffect(() => {
    let activeStream = null;
    const startCamera = async () => {
      try {
        const constraints = {
          video: { facingMode: "user" },
          audio: false
        };
        const stm = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = stm;
        setStream(stm);
        if (videoRef.current) {
          videoRef.current.srcObject = stm;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Camera permission denied or not available. Please allow camera access to capture the memory.");
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takeSnapshot = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      // High-resolution snap
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      // Mirror the canvas context horizontally because the video is mirrored
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Trigger flash and show preview
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 500); // 500ms flash duration
      setPreviewImage(dataUrl);
    }
  }, []);

  const confirmAndSave = () => {
    // Save Locally to React State / LocalStorage
    onCapture(previewImage);

    // Async Send to Google Drive + Email notification
    if (GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
          image: previewImage,
          filename: `${currentGift.replace(/[^a-zA-Z0-9]/g, '_')}_Memory.jpg`,
          source: isUploadedPhoto ? 'upload' : 'webcam',
          sendEmail: true,
          giftName: currentGift
        })
      }).catch(err => console.error("Failed to upload to Google Drive:", err));
    }
  };

  const retakePhoto = () => {
    setPreviewImage(null);
    setCapturing(false);
    setCountdown(null);
    setIsUploadedPhoto(false);
  };

  const handleCaptureClick = () => {
    setCapturing(true);
    let count = 3;
    setCountdown(count);
    
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else if (count === 0) {
        setCountdown('📸');
      } else {
        clearInterval(interval);
        takeSnapshot();
      }
    }, 1000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Trigger the same camera flash effect for uploads too!
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 600);
        setIsUploadedPhoto(true);
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be re-selected
    event.target.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div style={{ position: 'absolute', top: '40px', textAlign: 'center', zIndex: 10 }}>
        <h2 style={{ color: '#ffd700', fontSize: '2rem', marginBottom: '10px' }}>
          Capture a Memory
        </h2>
        <p style={{ color: '#fff', opacity: 0.8 }}>
          Smile! This memory for {currentGift} will be saved forever.
        </p>
      </div>

      {showFlash && (
        <motion.div
           initial={{ opacity: 1 }}
           animate={{ opacity: 0 }}
           transition={{ duration: 0.5 }}
           style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#fff', zIndex: 10000 }}
        />
      )}

      {error && !previewImage ? (
        <div style={{ padding: '20px', backgroundColor: '#333', borderRadius: '10px', textAlign: 'center', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <p style={{ color: '#ff6b6b' }}>{error}</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={{ padding: '10px 20px', background: '#fff', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              📂 Upload Instead
            </button>
            <button 
              onClick={onCancel}
              style={{ padding: '10px 20px', background: '#555', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Skip
            </button>
          </div>
        </div>
      ) : previewImage ? (
        // --- PREMIUM POLAROID PREVIEW MODE ---
        <motion.div 
          initial={{ scale: 0.8, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: -2, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          style={{
             background: '#fff',
             padding: '20px 20px 60px 20px',
             boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
             borderRadius: '5px',
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             maxWidth: '600px',
             zIndex: 20
          }}
        >
          <img src={previewImage} alt="Captured Preview" style={{ width: '100%', borderRadius: '3px', filter: 'contrast(1.1) brightness(1.05)', backgroundColor: '#000', transform: 'scaleX(-1)' }} />
          <p style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '1.5rem', 
            color: '#333', 
            margin: '20px 0 0 0', 
            fontStyle: 'italic' 
          }}>
            {currentGift}
          </p>
        </motion.div>
      ) : (
        // --- LIVE CAMERA MODE ---
        <div style={{ position: 'relative', width: '100%', maxWidth: '800px', aspectRatio: '16/9', backgroundColor: '#111', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {countdown !== null && (
            <div style={{ 
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
              display: 'flex', justifyContent: 'center', alignItems: 'center', 
              backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 20 
            }}>
              <span style={{ fontSize: '10rem', color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
                {countdown}
              </span>
            </div>
          )}
        </div>
      )}

      <div style={{ position: 'absolute', bottom: '50px', display: 'flex', gap: '20px', zIndex: 30 }}>
        {!error && !previewImage && (
          <>
            <button
              onClick={handleCaptureClick}
              disabled={capturing}
              style={{
                padding: '15px 40px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: capturing ? '#888' : '#ffd700',
                color: '#000',
                border: 'none',
                borderRadius: '50px',
                cursor: capturing ? 'not-allowed' : 'pointer',
                boxShadow: capturing ? 'none' : '0 10px 20px rgba(255,215,0,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {capturing ? 'Wait...' : '📸 Take Photo'}
            </button>
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              disabled={capturing}
              style={{
                padding: '15px 40px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: capturing ? '#888' : '#fff',
                color: '#000',
                border: 'none',
                borderRadius: '50px',
                cursor: capturing ? 'not-allowed' : 'pointer',
                boxShadow: capturing ? 'none' : '0 10px 20px rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              📂 Upload Photo
            </button>
          </>
        )}

        {previewImage && (
          <>
            <button
              onClick={retakePhoto}
              style={{
                padding: '15px 30px',
                fontSize: '1.2rem',
                backgroundColor: 'transparent',
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={(e) => { e.target.style.background = 'transparent' }}
            >
              🔄 Retake
            </button>
            <button
              onClick={confirmAndSave}
              style={{
                padding: '15px 40px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: '#ffd700',
                color: '#000',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(255,215,0,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)' }}
              onMouseLeave={(e) => { e.target.style.transform = 'scale(1)' }}
            >
              ✨ Keep & Save
            </button>
          </>
        )}

        {!previewImage && (
          <button
            onClick={onCancel}
            style={{
              padding: '15px 30px',
              fontSize: '1.2rem',
              backgroundColor: 'transparent',
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent' }}
          >
             Cancel
          </button>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileUpload} 
      />
    </motion.div>
  );
}
