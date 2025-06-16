import React from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipForward, RotateCcw, Volume2 } from 'lucide-react'
import type { StoryScene } from '../types'

interface StoryControlsProps {
  currentScene: StoryScene | null
  onSceneChange: (scene: StoryScene) => void
  isPlaying: boolean
  onPlayPause: () => void
}

const StoryControls: React.FC<StoryControlsProps> = ({
  currentScene,
  onSceneChange,
  isPlaying,
  onPlayPause
}) => {
  const handleNextScene = () => {
    // In a real implementation, this would fetch the next scene from the backend
    console.log('Next scene requested')
  }

  const handleRestart = () => {
    // Restart current scene
    console.log('Restart scene requested')
  }

  const handleVolumeToggle = () => {
    // Toggle audio volume
    console.log('Volume toggle requested')
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold child-interface">
        Story Controls
      </h3>
      
      {currentScene && (
        <div className="bg-white/10 rounded-lg p-4 space-y-3">
          <div>
            <h4 className="text-white font-medium text-sm child-interface">
              Current Scene
            </h4>
            <p className="text-white/80 text-xs">
              {currentScene.title}
            </p>
          </div>
          
          <div className="flex justify-center space-x-2">
            <motion.button
              onClick={handleRestart}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={onPlayPause}
              className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </motion.button>
            
            <motion.button
              onClick={handleNextScene}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={handleVolumeToggle}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Volume2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}
      
      <div className="bg-white/10 rounded-lg p-3">
        <div className="text-white/70 text-xs space-y-1">
          <div>Scene: {currentScene?.mood || 'Loading...'}</div>
          <div>Characters: {currentScene?.characters.length || 0}</div>
        </div>
      </div>
    </div>
  )
}

export default StoryControls