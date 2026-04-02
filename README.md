# Flixx App - Pro TikTok Style Social Media Platform

Welcome to **Flixx App**, a modern, high-performance social media experience built with **Flutter** and **Node.js**. This project features a vertical full-screen video feed, persistent user sessions, and real-time media uploads.

## 🚀 Project Overview

Flixx App is designed to provide an immersive "TikTok-style" experience where users can:
- **Scroll** through a vertical, full-screen feed of images and videos.
- **Upload** real media directly from their device (Camera/Gallery).
- **Interact** with content through likes, comments, and shares.
- **Stay Logged In** with persistent JWT-based authentication.
- **Enjoy** a stunning "Deep Space" dark mode UI with glassmorphic elements.

---

## 🛠️ Technology Stack

### Backend
- **Node.js & Express**: High-speed REST API.
- **PostgreSQL**: Robust relational database for users, follows, and posts.
- **Multer**: Secure multi-part file handling for media storage.
- **JWT**: Stateless authentication for secure sessions.

### Frontend (Mobile)
- **Flutter**: Cross-platform performant UI.
- **Dio**: Advanced networking for media uploads.
- **Chewie & Video Player**: Professional video playback with auto-play logic.
- **Google Fonts (Inter)**: Premium typography for a modern look.
- **Shared Preferences**: Local storage for session persistence.

---

## 📂 Project Structure
```text
/backend          # Node.js API & Database Schema
  /controllers    # Business logic
  /routes         # API Endpoints
  /uploads        # (Ignored) Real media storage
  /sql            # Initial DB setup scripts
/flixx_app        # Flutter Mobile Application
  /lib/screens    # UI Screens (Auth, Feed, Profile)
  /lib/widgets    # Reusable components (PostCard)
  /lib/theme      # Global styling & colors
```

---

## ⚙️ Setup & Installation

### 1. Backend Setup
1. Navigate to `/backend`.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on `.env.example`.
4. Initialize the PostgreSQL database using `sql/init_db.sql`.
5. Start the server: `npm start`.

### 2. Flutter Setup
1. Navigate to `/flixx_app`.
2. Get dependencies: `flutter pub get`.
3. Ensure the `baseUrl` in `lib/api_service.dart` points to your running backend.
4. Run the app: `flutter run`.

---

## 🔒 Security & Best Practices
- **Environment variables** are used for all sensitive database credentials.
- **.gitignore** is configured to exclude `node_modules`, `.env`, and `uploads/`.
- **JWT Auth** is required for all post creation and feed operations.
- **Apple/Android Permissions** are correctly configured for Media access.

---

## 💎 Features Walkthrough
- **Deep Dark Theme**: HSL-tailored colors for maximum visual comfort.
- **Glassmorphism**: Elegant blur effects on authentication screens.
- **Smooth Transitions**: Micro-animations for a premium user experience.

---
*Created with ❤️ by Antigravity AI.*
