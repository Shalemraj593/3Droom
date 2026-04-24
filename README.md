# 3Droom - Premium Giftbox Experience 🎁✨

Welcome to the **Premium 3D Giftbox Experience**, an immersive web application designed to take users on a magical journey of discovery and celebration. Built with React, Three.js, and Framer Motion, this project blends high-end 3D environments with emotional storytelling.

---

## 🌟 What is this Project?
This is a personalized, interactive 3D unboxing journey. Instead of a simple webpage, users enter a detailed **3D Virtual Room** where they explore, find hidden secrets, and unlock a sequence of 11 unique gifts. It’s designed as a premium birthday or anniversary surprise experience.

---

## 🚀 The User Experience Journey

### 1. The Landing (The Hook)
Users are greeted with a mysterious, floating 3D Giftbox. A soft countdown and premium overlay set the stage, inviting the user to "Open the Box" to reveal the world inside.

### 2. Room Exploration (The Discovery)
Once inside, the user is placed in a beautifully lit **3D Room**. 
- **Interactivity**: Users can scroll down to explore the room.
- **Hidden Characters**: Interact with characters like the **Panda, Bunny, and Happysad** toy, each sharing a unique story.
- **Zoom Features**: Smooth camera transitions allow users to zoom into the laptop screen or photo frames for a closer look.

### 3. The Sequential Unboxing (The Challenge)
Users must find **11 specific gifts** hidden within a 3D gallery. 
- **Order Matters**: Gifts must be unlocked sequentially (Gift 1, then Gift 2, etc.).
- **Click Precision**: Some boxes are tricky! Users might need to rotate the camera and try different angles to find the right spot to click.

### 4. Interactive Reveal & Capture Mode (The Memories)
When a gift is found:
- **3D Reveal**: The specific gift (e.g., Balloons, Phone, Jewelry) appears in a cinematic standalone 3D view.
- **Capture Mode**: Users are encouraged to use their **Webcam** to take a photo of themselves with the gift (Virtual + Real unboxing).
- **Return vs. Capture**: Users can choose to "Capture Moment" (saves to collage) or "Return to Gallery" (skips capture).

### 5. The Heart Collage & Final Reveal (The Conclusion)
- **Automatic Collage**: All captured photos are automatically arranged into a beautiful **Rectangular Memory Grid**.
- **Signature & Save**: Users can see their journey's summary and download the memory frame.
- **Thank You Screen**: The journey ends with a premium "Thank You" screen featuring a special message and the "Visit Again" invitation.

---

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite
- **3D Engine**: React Three Fiber (Three.js), @react-three/drei
- **Animations**: Framer Motion, GSAP
- **Styling**: Vanilla CSS (Premium Dark Theme)

---

## 💻 How to Access & Run Locally

### Prerequisites
- Node.js (v16 or higher)
- A modern browser with WebGL support

### Setup Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Shalemraj593/3Droom.git
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Development Server**:
   ```bash
   npm run dev
   ```
4. **Open in Browser**:
   Navigate to `http://localhost:5173/` to start the experience.

---

## 📁 Important Folders
- `/public/models/`: Contains all custom `.glb` 3D models and textures.
- `/src/components/`: Core interactive components (Room, GiftsPage, Reveal, Collage).
- `/src/App.jsx`: Main application logic and navigation flow.

---

**Created with ❤️ by Shalem**
