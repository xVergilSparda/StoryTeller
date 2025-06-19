import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'

import StorySelection from './StorySelection'
import TauvusStoryInterface from './TauvusStoryInterface'
import { type StoryTemplate } from '../services/storyService'
import { type TauvusReplica } from '../services/tauvusService'
import type { TranscriptEntry, SafetyAlert } from '../types'

const StorytellingInterface: React.FC = () => {
  const { sessionId } = useParams()
  const [currentView, setCurrentView] = useState<'selection' | 'story' | 'ended'>('selection')
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate | null>(null)
  const [selectedReplica, setSelectedReplica] = useState<TauvusReplica | null>(null)
  const [childAge, setChildAge] = useState(7) // Default age, would come from user preferences
  const [childName, setChildName] = useState('Friend') // Default name

  // Load user preferences (mock for now)
  useEffect(() => {
    // In production, this would load from user preferences or Auth0 user metadata
    const mockPreferences = {
      childName: 'Emma',
      childAge: 7
    }
    setChildName(mockPreferences.childName)
    setChildAge(mockPreferences.childAge)
  }, [])

  const handleStorySelect = (template: StoryTemplate, replica: TauvusReplica) => {
    setSelectedTemplate(template)
    setSelectedReplica(replica)
    setCurrentView('story')
  }

  const handleSessionEnd = (transcript: TranscriptEntry[], safetyAlerts: SafetyAlert[]) => {
    console.log('Session ended:', { transcript, safetyAlerts })
    
    // In production, this would:
    // 1. Save session data if parent allows
    // 2. Generate safety report for parents
    // 3. Update child's progress/preferences
    
    setCurrentView('ended')
  }

  const handleEmergencyStop = () => {
    console.log('Emergency stop activated')
    
    // In production, this would:
    // 1. Immediately alert parents
    // 2. Save emergency session data
    // 3. Potentially contact support
    
    setCurrentView('ended')
  }

  const handleBackToSelection = () => {
    setSelectedTemplate(null)
    setSelectedReplica(null)
    setCurrentView('selection')
  }

  if (currentView === 'selection') {
    return (
      <StorySelection
        childAge={childAge}
        onStorySelect={handleStorySelect}
      />
    )
  }

  if (currentView === 'story' && selectedTemplate && selectedReplica) {
    return (
      <TauvusStoryInterface
        template={selectedTemplate}
        replica={selectedReplica}
        childName={childName}
        onSessionEnd={handleSessionEnd}
        onEmergencyStop={handleEmergencyStop}
      />
    )
  }

  if (currentView === 'ended') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
        <div className="text-center child-interface">
          <motion.div
            className="text-8xl mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            🌟
          </motion.div>
          
          <motion.h2
            className="text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Great Story Time!
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Thanks for sharing that adventure with me, {childName}!
          </motion.p>
          
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={handleBackToSelection}
              className="btn-primary mr-4"
            >
              Tell Another Story
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="btn-secondary"
            >
              Go Home
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return null
}

export default StorytellingInterface