# 🎮 Rehacktor - Game Discovery Platform

A modern game discovery platform built with React and powered by the RAWG API, offering a seamless experience for gamers to explore, track, and discuss their favorite games.

## ✨ Features

### 🎯 Game Discovery
- Infinite scroll for endless game browsing 🔄
- High-quality game screenshots and details 🖼️
- Release dates and ratings tracking 📅
- Real-time search with auto-suggestions 🔍

### 👤 User Features
- Multiple sign-in options (Email/Password, GitHub) 🔐
- Personal favorites collection ❤️
- Comment system for game discussions 💬
- Custom user profiles 👤
- Protected routes for user-specific features 🛡️
- Password reset functionality via email 🔑
- Forgot password link in login page 🔒

### 🌟 Profile & Settings Features
- Comprehensive user profile dashboard 📊
- Game statistics and play history tracking 🎮
- Personalized avatar generation 🖼️
- Privacy and notification settings 🔔
- Password strength meter 🔒
- Account customization options 🛠️

### 🎨 UI/UX Features
- Responsive design for all devices 📱
- Beautiful transitions and loading states ✨
- Dark theme optimization 🌙
- Clean and intuitive interface 🎯

## 🚀 Tech Stack

- **Frontend:** 
  - React + Vite
  - Tailwind CSS
  - React Router
  - React Context
- **Backend:**
  - Firebase Auth
  - Firebase Firestore
- **API:** RAWG Video Games Database

## 🛠️ Installation

1. Clone the repository
  bash 
  git clone https://github.com/AntoDav00/ReHacktor.git

2. Install dependencies
  bash 
  npm install

3. Configure environment variables
  bash cp .env.example .env
  VITE_FIREBASE_API_KEY=your_api_key
  VITE_RAWG_API_KEY=your_rawg_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
  VITE_FIREBASE_PROJECT_ID=your_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
  VITE_FIREBASE_APP_ID=your_app_id
  VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

4. Run the development server
  bash 
  npm run dev

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   ├── AutoCompleteCardUi/
│   │   ├── Index.jsx
│   │   ├── styles.module.css
│   ├── Features/
│   │   ├── infiniteScroll.jsx
│   │   ├── LoadingSkeleton.jsx
│   ├── Footer/
│   │   ├── Footer.jsx
│   ├── Game/
│   │   ├── CommentDeleteModal.jsx
│   │   ├── Comments.jsx
│   │   ├── FavoriteButton.jsx
│   │   ├── GameAchievements.jsx
│   │   ├── GameCard.jsx
│   │   ├── GameFilter.jsx
│   │   └── ScreenshotsGallery.jsx
│   ├── Navbar/
│   │   └── Navbar.jsx
│   └── ScrollToTop.jsx
│   └── FavoriteButton.jsx
├── config/
│   └── firebase.js
├── contexts/
│   └── AuthContext.jsx
├── pages/
│   └── Categories.jsx
│   └── Favorites.jsx
│   └── GameDetails.jsx
│   └── Home.jsx
│   └── Search.jsx
├── utils/
│   ├── firebase.js
│   ├── firebaseComments.js
│   └── logger.js
├── App.jsx
├── index.css
└── main.jsx
```

## 🔑 Key Features Implementation

- **Authentication:** Firebase Auth integration
- **Game Data:** RAWG API integration
- **State Management:** React Context implementation
- **Routing:** Protected and public routes
- **User Data:** Firestore database management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

- **GitHub:** [Antonio](https://https://bit.ly/GitAntoDav)
- **LinkedIn:** [Antonio](https://bit.ly/LinkedinAntonio)

## 📌 Deployment

[![Netlify Status](https://api.netlify.com/api/v1/badges/fa73c65f-056a-47c1-93c9-713649163192/deploy-status)](https://app.netlify.com/sites/rehacktor/deploys)

- **Link:** [Rehacktor](https://rehacktor.netlify.app/)

---

<div align="center">
  Made with ❤️ by <strong>Antonio D'Aversa</strong><br>
  <sup>© 2024 Rehacktor. All rights reserved.</sup>
</div>
