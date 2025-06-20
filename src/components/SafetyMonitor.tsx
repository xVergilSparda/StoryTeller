import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle, X } from 'lucide-react'
import type { SafetyAlert } from '../types'

interface SafetyMonitorProps {
  alerts: SafetyAlert[]
  onDismissAlert: (index: number) => void
  onEmergencyStop: () => void
}

const SafetyMonitor: React.FC<SafetyMonitorProps> = ({
  alerts,
  onDismissAlert,
  onEmergencyStop
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const activeAlerts = alerts.filter(alert => !alert.resolved)
  const highPriorityAlerts = activeAlerts.filter(alert => alert.level === 'high')

  // Auto-expand if there are high priority alerts
  useEffect(() => {
    if (highPriorityAlerts.length > 0) {
      setIsExpanded(true)
    }
  }, [highPriorityAlerts.length])

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'low': return 'text-blue-400 bg-blue-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-4 h-4" />
      case 'medium': return <Shield className="w-4 h-4" />
      case 'low': return <CheckCircle className="w-4 h-4" />
      default: return <Shield className="w-4 h-4" />
    }
  }

  if (activeAlerts.length === 0) {
    return (
      <div className="bg-green-500/20 backdrop-blur-sm text-green-300 p-3 rounded-full flex items-center gap-2">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">All Safe</span>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Safety Status Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`p-3 rounded-full backdrop-blur-sm transition-colors flex items-center gap-2 ${
          highPriorityAlerts.length > 0 
            ? 'bg-red-500/20 text-red-300' 
            : 'bg-yellow-500/20 text-yellow-300'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {highPriorityAlerts.length > 0 ? (
          <AlertTriangle className="w-5 h-5" />
        ) : (
          <Shield className="w-5 h-5" />
        )}
        {activeAlerts.length > 0 && (
          <span className="text-xs font-bold bg-white/20 rounded-full w-5 h-5 flex items-center justify-center">
            {activeAlerts.length}
          </span>
        )}
      </motion.button>

      {/* Expanded Alert Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-black/80 backdrop-blur-sm rounded-xl border border-white/20 p-4 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Safety Monitor
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto hide-scrollbar">
              {activeAlerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg ${getAlertColor(alert.level)}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      {getAlertIcon(alert.level)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {alert.level.toUpperCase()} Alert
                        </p>
                        <p className="text-xs opacity-80 mt-1">
                          Context: {alert.context}
                        </p>
                        {alert.keywords.length > 0 && (
                          <p className="text-xs opacity-60 mt-1">
                            Keywords: {alert.keywords.join(', ')}
                          </p>
                        )}
                        <p className="text-xs opacity-60 mt-1">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onDismissAlert(index)}
                      className="text-current opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {highPriorityAlerts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <button
                  onClick={onEmergencyStop}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Emergency Stop Session
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SafetyMonitor