import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { StoryChoice } from '../services/storyService'

interface InteractiveChoicesProps {
  choices: StoryChoice[]
  onChoiceSelect: (choice: StoryChoice) => void
  disabled?: boolean
}

const InteractiveChoices: React.FC<InteractiveChoicesProps> = ({
  choices,
  onChoiceSelect,
  disabled = false
}) => {
  if (!choices || choices.length === 0) {
    return null
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 text-white">
        <Sparkles className="w-5 h-5 text-primary-400" />
        <h3 className="font-semibold child-interface">What happens next?</h3>
      </div>
      
      <p className="text-white/80 text-sm child-interface">
        You get to choose what happens in our story!
      </p>

      <div className="space-y-3">
        {choices.map((choice, index) => (
          <motion.button
            key={choice.id}
            onClick={() => !disabled && onChoiceSelect(choice)}
            disabled={disabled}
            className={`w-full text-left p-4 rounded-xl transition-all child-interface ${
              disabled 
                ? 'bg-white/5 text-white/50 cursor-not-allowed'
                : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={disabled ? {} : { scale: 1.02 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-lg mb-1">
                  {choice.text}
                </p>
                {choice.consequence && (
                  <p className="text-sm opacity-80">
                    {choice.consequence}
                  </p>
                )}
              </div>
              <ArrowRight className="w-5 h-5 ml-3 flex-shrink-0" />
            </div>
          </motion.button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-white/60 text-xs child-interface">
          Choose the option that sounds most exciting to you!
        </p>
      </div>
    </div>
  )
}

export default InteractiveChoices