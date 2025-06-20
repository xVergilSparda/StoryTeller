import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Home,
  AlertTriangle,
  Clock,
  Pause,
  Play
} from 'lucide-react'

import { tauvusService, type TauvusReplica, type TauvusConversation } from '../services/tauvusService'
import { storyService, type StoryTemplate } from '../services/storyService'
import EmotionDetector from './EmotionDetector'
import VoiceInput from './VoiceInput'
import type { EmotionalState, SafetyAlert, TranscriptEntry } from '../types'

interface TauvusStoryInterfaceProps {
  template: StoryTemplate
  replica: TauvusReplica
  childName: string
  onSessionEnd: (transcript: TranscriptEntry[], safetyAlerts: SafetyAlert[]) => void
  onEmergencyStop: () => void
}

const TauvusStoryInterface: React.FC<TauvusStoryInterfaceProps> = ({
  template,
  replica,
  childName,
  onSessionEnd,
  onEmergencyStop
}) => {
  // Session state
  const [conversation, setConversation] = useState<TauvusConversation | null>(null)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(600) // 10 minutes in seconds
  
  // Story state
  const [currentMilestone, setCurrentMilestone] = useState<string>('')
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([])
  
  // Interaction state
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize session
  useEffect(() => {
    initializeSession()
    return cleanup
  }, [])

  // Session timer
  useEffect(() => {
    if (isSessionActive && sessionStartTime) {
      sessionTimerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000)
        const remaining = Math.max(0, 600 - elapsed)
        setTimeRemaining(remaining)
        
        if (remaining === 0) {
          handleSessionTimeout()
        }
      }, 1000)
    }
    
    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current)
      }
    }
  }, [isSessionActive, sessionStartTime])

  const initializeSession = async () => {
    try {
      // Create Tauvus conversation
      const newConversation = await tauvusService.createConversation({
        replica_id: replica.replica_id,
        conversation_name: `${childName} - ${template.title}`,
        properties: {
          max_call_duration: 600, // 10 minutes
          enable_recording: true,
          enable_transcription: true
        }
      })
      
      setConversation(newConversation)
      setIsSessionActive(true)
      setSessionStartTime(new Date())
      
      // Initialize first milestone
      if (template.milestones && template.milestones.length > 0) {
        setCurrentMilestone(template.milestones[0].id)
      }
      
      // Initialize camera if enabled
      if (cameraEnabled) {
        await initializeCamera()
      }
      
      // Add initial transcript entry
      addTranscriptEntry('system', `Story session started: ${template.title}`)
      
    } catch (error) {
      console.error('Failed to initialize session:', error)
      onEmergencyStop()
    }
  }

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Camera access denied:', error)
      setCameraEnabled(false)
    }
  }

  const cleanup = () => {
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current)
    }
    
    if (conversation) {
      tauvusService.endConversation(conversation.conversation_id)
        .catch(console.error)
    }
  }

  const addTranscriptEntry = (speaker: 'child' | 'character' | 'system', text: string, emotion?: string) => {
    const entry: TranscriptEntry = {
      timestamp: new Date(),
      speaker,
      text,
      emotion,
      confidence: 1.0
    }
    setTranscript(prev => [...prev, entry])
  }

  const handleEmotionDetected = (emotion: EmotionalState) => {
    setEmotionalState(emotion)
    
    // Analyze emotional state for story adaptation
    const dominantEmotion = Object.entries(emotion.emotions)
      .reduce((a, b) => emotion.emotions[a[0] as keyof typeof emotion.emotions] > emotion.emotions[b[0] as keyof typeof emotion.emotions] ? a : b)[0]
    
    // Log significant emotional changes
    if (emotion.emotions.fear > 0.7 || emotion.emotions.sadness > 0.6) {
      addTranscriptEntry('system', `Child showing signs of ${dominantEmotion}`, dominantEmotion)
    }
  }

  const handleVoiceInput = (text: string) => {
    addTranscriptEntry('child', text)
    
    // Analyze for safety concerns
    const safetyAlert = storyService.analyzeSafety(text)
    if (safetyAlert) {
      setSafetyAlerts(prev => [...prev, safetyAlert])
      
      if (safetyAlert.level === 'high') {
        handleEmergencyStop()
        return
      }
    }
    
    // Generate story response
    const emotionalStateKey = emotionalState 
      ? Object.entries(emotionalState.emotions)
          .reduce((a, b) => emotionalState.emotions[a[0] as keyof typeof emotionalState.emotions] > emotionalState.emotions[b[0] as keyof typeof emotionalState.emotions] ? a : b)[0]
      : 'neutral'
    
    const storyResponse = storyService.generateStoryResponse(
      template,
      currentMilestone,
      text,
      emotionalStateKey
    )
    
    if (storyResponse.safetyAlert) {
      setSafetyAlerts(prev => [...prev, storyResponse.safetyAlert!])
    }
    
    // Add character response to transcript
    addTranscriptEntry('character', storyResponse.response)
    
    // Update milestone if needed
    if (storyResponse.nextMilestone) {
      setCurrentMilestone(storyResponse.nextMilestone)
    }
    
    // End session if story is complete
    if (!storyResponse.shouldContinue) {
      handleSessionEnd()
    }
  }

  const handleSessionTimeout = () => {
    addTranscriptEntry('system', 'Session ended due to time limit')
    handleSessionEnd()
  }

  const handleSessionEnd = () => {
    setIsSessionActive(false)
    cleanup()
    onSessionEnd(transcript, safetyAlerts)
  }

  const handleEmergencyStop = () => {
    addTranscriptEntry('system', 'Emergency stop activated')
    setIsSessionActive(false)
    cleanup()
    onEmergencyStop()
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!isSessionActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
        <div className="text-center child-interface">
          <motion.div
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <motion.div
                className="w-4 h-4 bg-primary-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Starting Your Story...
          </h2>
          <p className="text-gray-600 text-lg">
            {template.title} is about to begin!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")] opacity-30"></div>
      
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSessionEnd}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              <Home className="w-5 h-5" />
            </button>
            
            <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
              <span className="text-sm font-medium child-interface">
                {template.title}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Timer */}
            <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            {/* Safety Alert */}
            {safetyAlerts.length > 0 && (
              <div className="bg-yellow-500/20 backdrop-blur-sm text-yellow-300 p-3 rounded-full">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            
            {/* Camera Toggle */}
            <button
              onClick={() => setCameraEnabled(!cameraEnabled)}
              className={`p-3 rounded-full transition-colors ${
                cameraEnabled 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}
            >
              {cameraEnabled ? '📹' : '📷'}
            </button>
            
            {/* Audio Toggle */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-3 rounded-full transition-colors ${
                audioEnabled 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            {/* Emergency Stop */}
            <button
              onClick={handleEmergencyStop}
              className="bg-red-500/20 backdrop-blur-sm text-red-300 p-3 rounded-full hover:bg-red-500/30 transition-colors"
            >
              <Pause className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-screen pt-20">
        {/* Tauvus Video Area */}
        <div className="flex-1 relative flex items-center justify-center">
          {conversation && (
            <div className="w-full max-w-4xl aspect-video bg-black/20 rounded-2xl overflow-hidden">
              {/* Tauvus iframe would go here */}
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-8xl mb-4">🎭</div>
                  <h3 className="text-2xl font-bold mb-2 child-interface">
                    {replica.replica_name}
                  </h3>
                  <p className="text-white/70 child-interface">
                    Telling: {template.title}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Story Progress */}
          <div className="absolute bottom-6 left-6 right-6">
            <motion.div
              className="bg-black/50 backdrop-blur-sm text-white p-4 rounded-xl child-interface"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-70">Story Progress</span>
                <span className="text-sm opacity-70">
                  Milestone: {currentMilestone}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(template.milestones?.findIndex(m => m.id === currentMilestone) + 1) / (template.milestones?.length || 1) * 100}%` 
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-black/30 backdrop-blur-sm p-6 space-y-6">
          {/* Child's Video Feed */}
          {cameraEnabled && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold child-interface">
                You're on Camera! 📸
              </h3>
              
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-32 object-cover rounded-lg"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              
              <EmotionDetector
                videoRef={videoRef}
                canvasRef={canvasRef}
                onEmotionDetected={handleEmotionDetected}
                enabled={cameraEnabled}
              />
              
              {emotionalState && (
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white text-sm space-y-1">
                    <div>😊 Happy: {Math.round(emotionalState.emotions.joy * 100)}%</div>
                    <div>😮 Surprised: {Math.round(emotionalState.emotions.surprise * 100)}%</div>
                    <div>🎯 Attention: {Math.round(emotionalState.attention * 100)}%</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Voice Input */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold child-interface">
              Talk to the Story! 🎤
            </h3>
            
            <VoiceInput
              onVoiceInput={handleVoiceInput}
              onStartListening={() => setIsListening(true)}
              onStopListening={() => setIsListening(false)}
              enabled={audioEnabled}
            />
            
            <div className="flex justify-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-primary-500'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
            
            <p className="text-white/70 text-sm text-center child-interface">
              {isListening ? 'Listening...' : 'Tap to ask questions!'}
            </p>
          </div>

          {/* Recent Conversation */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold child-interface">
              Our Conversation
            </h3>
            
            <div className="bg-white/10 rounded-lg p-3 max-h-40 overflow-y-auto hide-scrollbar">
              {transcript.slice(-5).map((entry, index) => (
                <div key={index} className="mb-2 text-sm">
                  <span className={`font-medium ${
                    entry.speaker === 'child' ? 'text-blue-300' :
                    entry.speaker === 'character' ? 'text-green-300' :
                    'text-gray-400'
                  }`}>
                    {entry.speaker === 'child' ? 'You' :
                     entry.speaker === 'character' ? replica.replica_name :
                     'System'}:
                  </span>
                  <span className="text-white/80 ml-2">
                    {entry.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TauvusStoryInterface