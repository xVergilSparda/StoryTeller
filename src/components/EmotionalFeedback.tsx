import React from 'react'
import { motion } from 'framer-motion'
import type { EmotionalState } from '../types'

interface EmotionalFeedbackProps {
  emotionalState: EmotionalState | null
  childName: string
}

const EmotionalFeedback: React.FC<EmotionalFeedbackProps> = ({
  emotionalState,
  childName
}) => {
  if (!emotionalState) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
        <div className="text-4xl mb-2">😊</div>
        <p className="text-white/70 text-sm child-interface">
          Looking for your emotions...
        </p>
      </div>
    )
  }

  const getDominantEmotion = () => {
    const emotions = emotionalState.emotions
    const maxEmotion = Object.entries(emotions).reduce((a, b) => 
      emotions[a[0] as keyof typeof emotions] > emotions[b[0] as keyof typeof emotions] ? a : b
    )
    return maxEmotion[0]
  }

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case 'joy': return '😊'
      case 'surprise': return '😮'
      case 'anger': return '😠'
      case 'fear': return '😨'
      case 'sadness': return '😢'
      case 'disgust': return '😖'
      default: return '😐'
    }
  }

  const getEmotionMessage = (emotion: string) => {
    switch (emotion) {
      case 'joy': return `${childName} looks happy! 🌟`
      case 'surprise': return `${childName} seems surprised! ✨`
      case 'anger': return `${childName} might be frustrated. Let's make it better! 💙`
      case 'fear': return `${childName} looks worried. Everything is safe! 🛡️`
      case 'sadness': return `${childName} seems sad. Let's cheer up! 🌈`
      case 'disgust': return `${childName} doesn't seem to like this part. 🤔`
      default: return `${childName} is listening carefully! 👂`
    }
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'joy': return 'text-green-300 bg-green-500/20'
      case 'surprise': return 'text-yellow-300 bg-yellow-500/20'
      case 'anger': return 'text-red-300 bg-red-500/20'
      case 'fear': return 'text-purple-300 bg-purple-500/20'
      case 'sadness': return 'text-blue-300 bg-blue-500/20'
      case 'disgust': return 'text-orange-300 bg-orange-500/20'
      default: return 'text-gray-300 bg-gray-500/20'
    }
  }

  const dominantEmotion = getDominantEmotion()
  const emotionLevel = emotionalState.emotions[dominantEmotion as keyof typeof emotionalState.emotions]

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-4">
      <h3 className="text-white font-semibold child-interface">
        How {childName} is feeling
      </h3>

      <motion.div
        className={`p-4 rounded-xl ${getEmotionColor(dominantEmotion)}`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">
            {getEmotionEmoji(dominantEmotion)}
          </div>
          <p className="font-medium child-interface">
            {getEmotionMessage(dominantEmotion)}
          </p>
        </div>
      </motion.div>

      {/* Emotion Bars */}
      <div className="space-y-2">
        <div className="text-white/70 text-sm child-interface">Emotion levels:</div>
        {Object.entries(emotionalState.emotions).map(([emotion, level]) => (
          <div key={emotion} className="flex items-center gap-3">
            <div className="w-16 text-xs text-white/60 capitalize">
              {emotion}
            </div>
            <div className="flex-1 bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-primary-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${level * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="w-8 text-xs text-white/60">
              {Math.round(level * 100)}%
            </div>
          </div>
        ))}
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-lg font-bold text-primary-300">
            {Math.round(emotionalState.attention * 100)}%
          </div>
          <div className="text-xs text-white/60 child-interface">
            Attention
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-lg font-bold text-secondary-300">
            {Math.round(emotionalState.engagement * 100)}%
          </div>
          <div className="text-xs text-white/60 child-interface">
            Engagement
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmotionalFeedback