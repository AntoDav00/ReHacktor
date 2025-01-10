// eslint-disable-next-line no-unused-vars
import React, { useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import { AuthProvider } from './contexts/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import PrivateRoute from './components/Auth/PrivateRoute'
import { Toaster } from 'react-hot-toast'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const GameDetails = lazy(() => import('./pages/GameDetails'))
const Categories = lazy(() => import('./pages/Categories'))
const Login = lazy(() => import('./components/Auth/Login'))
const Signup = lazy(() => import('./components/Auth/Signup'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Search = lazy(() => import('./pages/Search'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))

// Import CSS
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const App = () => {
  const [filters, setFilters] = useState({
    platform: '',
    genre: '',
    sortBy: 'relevance'
  });

  const resetFilters = () => {
    setFilters({
      platform: '',
      genre: '',
      sortBy: 'relevance'
    });
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#4ade80',
                secondary: '#333',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#333',
              },
            },
          }}
        />
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar onResetFilters={resetFilters} />
          <main className="container mx-auto px-4 py-8">
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game/:id" element={<GameDetails />} />
                <Route path="/search" element={<Search />} />
                <Route path="/search/:query" element={<Search />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/settings" element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                } />
                <Route path="/login" element={<Login redirect="/" />} />
                <Route path="/signup" element={<Signup redirect="/" />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
