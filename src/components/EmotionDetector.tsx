import React, { useEffect, useRef, useState } from 'react'
import type { EmotionalState } from '../types'

interface EmotionDetectorProps {
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  onEmotionDetected: (emotion: EmotionalState) => void
  enabled: boolean
}

const EmotionDetector: React.FC<EmotionDetectorProps> = ({
  videoRef,
  canvasRef,
  onEmotionDetected,
  enabled
}) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled) {
      cleanup()
      return
    }

    initializeDetection()
    return cleanup
  }, [enabled])

  const initializeDetection = async () => {
    try {
      // In a real implementation, this would load TensorFlow.js models
      // For now, we'll simulate emotion detection
      setIsInitialized(true)
      startDetection()
    } catch (err) {
      setError('Failed to initialize emotion detection')
      console.error('Emotion detection error:', err)
    }
  }

  const startDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Simulate emotion detection every 500ms
    intervalRef.current = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return

      // Generate mock emotion data
      const mockEmotion: EmotionalState = {
        timestamp: new Date(),
        emotions: {
          joy: Math.random() * 0.8 + 0.1,
          surprise: Math.random() * 0.3,
          anger: Math.random() * 0.1,
          fear: Math.random() * 0.1,
          sadness: Math.random() * 0.1,
          disgust: Math.random() * 0.05,
          neutral: Math.random() * 0.4 + 0.3
        },
        attention: Math.random() * 0.6 + 0.4,
        engagement: Math.random() * 0.7 + 0.3,
        confidence: Math.random() * 0.3 + 0.7
      }

      onEmotionDetected(mockEmotion)
    }, 500)
  }

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsInitialized(false)
    setError(null)
  }

  if (!enabled) {
    return (
      <div className="text-white/70 text-sm text-center">
        Emotion detection disabled
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-400 text-sm text-center">
        {error}
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className="text-white/70 text-sm text-center">
        Initializing emotion detection...
      </div>
    )
  }

  return (
    <div className="text-green-400 text-sm text-center">
      Emotion detection active
    </div>
  )
}

export default EmotionDetector