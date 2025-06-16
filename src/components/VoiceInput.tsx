import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff } from 'lucide-react'

interface VoiceInputProps {
  onVoiceInput: (text: string) => void
  onStartListening: () => void
  onStopListening: () => void
  enabled: boolean
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onVoiceInput,
  onStartListening,
  onStopListening,
  enabled
}) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (!enabled) {
      stopListening()
      return
    }

    // Check for speech recognition support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser')
      return
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      onStartListening()
    }

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setTranscript(interimTranscript)

      if (finalTranscript) {
        onVoiceInput(finalTranscript)
        setTranscript('')
      }
    }

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`)
      setIsListening(false)
      onStopListening()
    }

    recognition.onend = () => {
      setIsListening(false)
      onStopListening()
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [enabled, onVoiceInput, onStartListening, onStopListening])

  const startListening = () => {
    if (!recognitionRef.current || !enabled) return

    try {
      recognitionRef.current.start()
    } catch (err) {
      setError('Failed to start speech recognition')
    }
  }

  const stopListening = () => {
    if (!recognitionRef.current) return

    try {
      recognitionRef.current.stop()
      setIsListening(false)
      onStopListening()
    } catch (err) {
      console.error('Error stopping speech recognition:', err)
    }
  }

  if (!enabled) {
    return (
      <div className="text-white/70 text-sm text-center">
        Voice input disabled
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

  return (
    <div className="space-y-3">
      {transcript && (
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-white text-sm">
            {transcript}
          </p>
        </div>
      )}
      
      <div className="text-center">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-primary-500 hover:bg-primary-600'
          }`}
          disabled={!enabled}
        >
          {isListening ? (
            <MicOff className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </div>
  )
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export default VoiceInput