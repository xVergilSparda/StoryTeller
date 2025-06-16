import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Home,
  Pause,
  Play,
  RotateCcw
} from 'lucide-react'

// Components
import Avatar3D from './Avatar3D'
import EmotionDetector from './EmotionDetector'
import VoiceInput from './VoiceInput'
import StoryControls from './StoryControls'

// Types
import type { EmotionalState, StoryScene, Character } from '../types'

const StorytellingInterface: React.FC = () => {
  // State management
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [currentScene, setCurrentScene] = useState<StoryScene | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mock story data - would come from AI backend
  const mockScene: StoryScene = {
    id: 'forest-adventure-1',
    title: 'The Magical Forest',
    description: 'You find yourself in a beautiful, enchanted forest where the trees seem to whisper secrets and magical creatures peek out from behind colorful flowers.',
    setting: 'enchanted_forest',
    characters: ['friendly-fox', 'wise-owl'],
    mood: 'mysterious',
    backgroundMusic: 'forest-ambience',
    visualElements: []
  }

  const mockCharacters: Character[] = [
    {
      id: 'friendly-fox',
      name: 'Finn the Fox',
      personality: 'curious and helpful',
      appearance: {
        model: 'fox-character',
        colors: { primary: '#ff6b35', secondary: '#ffffff', accent: '#2d3748' },
        accessories: ['blue-scarf'],
        expressions: []
      },
      voice: { speed: 1.0, pitch: 1.2, voice: 'cheerful-child', language: 'en' },
      role: 'companion',
      emotionalRange: {
        happiness: 0.8,
        excitement: 0.9,
        curiosity: 0.95,
        empathy: 0.7,
        playfulness: 0.85
      }
    }
  ]

  // Initialize session
  useEffect(() => {
    initializeSession()
  }, [])

  const initializeSession = async () => {
    try {
      // Set up mock data
      setCurrentScene(mockScene)
      setCharacters(mockCharacters)
      
      // Initialize camera and microphone
      if (cameraEnabled) {
        await initializeCamera()
      }
      
      setIsSessionActive(true)
    } catch (error) {
      console.error('Failed to initialize session:', error)
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

  const handleEmotionDetected = (emotion: EmotionalState) => {
    setEmotionalState(emotion)
    // Send emotion data to AI backend for story adaptation
    console.log('Emotion detected:', emotion)
  }

  const handleVoiceInput = (text: string) => {
    console.log('Voice input:', text)
    // Send voice input to AI backend
    // This would trigger story progression and character responses
  }

  const handleStartListening = () => {
    setIsListening(true)
  }

  const handleStopListening = () => {
    setIsListening(false)
  }

  const handleResetSession = () => {
    setIsSessionActive(false)
    setCurrentScene(null)
    setEmotionalState(null)
    // Clean up resources
    setTimeout(() => {
      initializeSession()
    }, 1000)
  }

  const handleGoHome = () => {
    window.location.href = '/'
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
            Preparing Your Story...
          </h2>
          <p className="text-gray-600 text-lg">
            Getting everything ready for your magical adventure!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoHome}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              <Home className="w-5 h-5" />
            </button>
            
            <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
              <span className="text-sm font-medium child-interface">
                {currentScene?.title || 'Story Time'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
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
            
            <button
              onClick={handleResetSession}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-screen">
        {/* 3D Avatar Area */}
        <div className="flex-1 relative">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            className="w-full h-full"
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="forest" />
            
            {characters.map((character) => (
              <Avatar3D
                key={character.id}
                character={character}
                emotionalState={emotionalState}
                isSpeaking={isSpeaking}
              />
            ))}
            
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 4}
            />
          </Canvas>
          
          {/* Story Text Overlay */}
          <div className="absolute bottom-20 left-4 right-4">
            <motion.div
              className="bg-black/50 backdrop-blur-sm text-white p-6 rounded-2xl child-interface"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-lg leading-relaxed">
                {currentScene?.description}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-black/30 backdrop-blur-sm p-6 space-y-6">
          {/* Emotion Detection */}
          {cameraEnabled && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold child-interface">
                Emotion Detection
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
                    <div>😊 Joy: {Math.round(emotionalState.emotions.joy * 100)}%</div>
                    <div>😮 Surprise: {Math.round(emotionalState.emotions.surprise * 100)}%</div>
                    <div>🎯 Attention: {Math.round(emotionalState.attention * 100)}%</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Voice Input */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold child-interface">
              Voice Interaction
            </h3>
            
            <VoiceInput
              onVoiceInput={handleVoiceInput}
              onStartListening={handleStartListening}
              onStopListening={handleStopListening}
              enabled={audioEnabled}
            />
            
            <div className="flex justify-center">
              <button
                onClick={isListening ? handleStopListening : handleStartListening}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-primary-500 hover:bg-primary-600'
                }`}
                disabled={!audioEnabled}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
            
            <p className="text-white/70 text-sm text-center child-interface">
              {isListening ? 'Listening...' : 'Tap to speak'}
            </p>
          </div>

          {/* Story Controls */}
          <StoryControls
            currentScene={currentScene}
            onSceneChange={setCurrentScene}
            isPlaying={!isListening}
            onPlayPause={() => {}}
          />
        </div>
      </div>
    </div>
  )
}

export default StorytellingInterface