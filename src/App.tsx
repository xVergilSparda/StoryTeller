import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { motion, AnimatePresence } from 'framer-motion'

// Components
import LoadingScreen from './components/LoadingScreen'
import LandingPage from './components/LandingPage'
import ParentDashboard from './components/ParentDashboard'
import StorytellingInterface from './components/StorytellingInterface'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isLoading, error } = useAuth0()

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-red-500">{error.message}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <ParentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/story/:sessionId?" 
            element={<StorytellingInterface />} 
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App