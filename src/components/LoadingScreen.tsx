import React from 'react'
import { motion } from 'framer-motion'

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
      <div className="text-center">
        <motion.div
          className="w-20 h-20 mx-auto mb-8"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
            <motion.div
              className="w-8 h-8 bg-white rounded-full"
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
        
        <motion.h2
          className="text-2xl font-bold text-gray-800 mb-4 child-interface"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading StoryTeller...
        </motion.h2>
        
        <motion.p
          className="text-gray-600 child-interface"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          Preparing your magical adventure
        </motion.p>
      </div>
    </div>
  )
}

export default LoadingScreen