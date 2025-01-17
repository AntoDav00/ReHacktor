/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import Loader from './components/Loader'

// Code Splitting con lazy loading
const Home = lazy(() => import('./pages/Home'))
const GameDetails = lazy(() => import('./pages/GameDetails'))
const Categories = lazy(() => import('./pages/Categories'))
const Login = lazy(() => import('./components/Auth/Login'))
const Signup = lazy(() => import('./components/Auth/Signup'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Search = lazy(() => import('./pages/Search'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))

import Navbar from './components/Navbar/Navbar'
import { AuthProvider } from './contexts/AuthContext'
import ScrollToTop from './components/ScrollToTop'

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

  // Aggiungi un wrapper per il debug del routing
  const DebugRouter = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
    }, [location, user, loading]);

    return null;
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <DebugRouter />
        <ScrollToTop />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            }
          }}
        />
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar onResetFilters={resetFilters} />
          <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* Rotte pubbliche */}
                <Route path="/login" element={<Login redirect="/" />} />
                <Route path="/signup" element={<Signup redirect="/" />} />
                
                {/* Rotte con accesso pubblico */}
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/search/:query" element={<Search />} />
                <Route path="/game/:id" element={<GameDetails />} />
                <Route path="/categories" element={<Categories />} />
                
                {/* Rotte che richiedono autenticazione */}
                <Route 
                  path="/favorites" 
                  element={
                    <RequireAuth>
                      <Favorites />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <RequireAuth>
                      <Settings />
                    </RequireAuth>
                  } 
                />
                
                {/* Rotta di fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

// Componente wrapper per le rotte private
const RequireAuth = ({ children }) => {
  const { user, loading, forceStopLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {
    // Gestisci timeout di caricamento
    const timer = setTimeout(() => {
      if (loading) {
        forceStopLoading();
        navigate('/login', { 
          state: { from: location },
          replace: true 
        });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [loading, navigate, location, forceStopLoading]);

  // Gestisci esplicitamente i casi di caricamento e autenticazione
  if (loading) {
    return <Loader />
  }

  if (!user) {
    return <Navigate 
      to="/login" 
      state={{ from: location }} 
      replace 
    />
  }

  return children;
};

export default App
