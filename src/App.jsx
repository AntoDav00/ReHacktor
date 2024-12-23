// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import GameDetails from './pages/GameDetails'
import Categories from './pages/Categories'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Navbar from './components/Navbar/Navbar'
import Favorites from './pages/Favorites'
import { AuthProvider } from './contexts/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import Search from './pages/Search'

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
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar onResetFilters={resetFilters} />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/search/:query" element={<Search />} />
              <Route path="/game/:id" element={<GameDetails />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/login" element={<Login redirect="/" />} />
              <Route path="/signup" element={<Signup redirect="/" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
