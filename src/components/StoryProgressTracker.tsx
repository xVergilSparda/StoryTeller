import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Star } from 'lucide-react'
import type { StoryTemplate } from '../services/storyService'

interface StoryProgressTrackerProps {
  template: StoryTemplate
  currentMilestone: string
  completedMilestones: string[]
}

const StoryProgressTracker: React.FC<StoryProgressTrackerProps> = ({
  template,
  currentMilestone,
  completedMilestones
}) => {
  const currentIndex = template.milestones.findIndex(m => m.id === currentMilestone)
  const progress = ((currentIndex + 1) / template.milestones.length) * 100

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold child-interface">Story Progress</h3>
        <div className="text-white/70 text-sm">
          {currentIndex + 1} of {template.milestones.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/20 rounded-full h-3">
        <motion.div 
          className="bg-gradient-to-r from-primary-400 to-secondary-400 h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Milestone List */}
      <div className="space-y-2 max-h-32 overflow-y-auto hide-scrollbar">
        {template.milestones.map((milestone, index) => {
          const isCompleted = completedMilestones.includes(milestone.id)
          const isCurrent = milestone.id === currentMilestone
          const isPast = index < currentIndex

          return (
            <motion.div
              key={milestone.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                isCurrent ? 'bg-primary-500/20' : 
                isCompleted ? 'bg-green-500/20' : 
                'bg-white/5'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : isCurrent ? (
                  <Star className="w-5 h-5 text-primary-400" />
                ) : (
                  <Circle className="w-5 h-5 text-white/40" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  isCurrent ? 'text-primary-300' :
                  isCompleted ? 'text-green-300' :
                  'text-white/70'
                }`}>
                  {milestone.title}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default StoryProgressTracker