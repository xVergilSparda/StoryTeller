import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth0 } from '@auth0/auth0-react'
import { 
  Settings, 
  Play, 
  Shield, 
  Clock, 
  Volume2, 
  Eye, 
  Save,
  LogOut,
  User,
  Heart,
  BarChart3
} from 'lucide-react'

const ParentDashboard: React.FC = () => {
  const { user, logout } = useAuth0()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Mock data - would come from API in production
  const [settings, setSettings] = useState({
    childName: 'Emma',
    childAge: 7,
    maxSessionDuration: 30,
    contentFilters: {
      violence: false,
      scary: false,
      educational: true,
      fantasy: true
    },
    privacy: {
      saveSessionData: false,
      allowEmotionDetection: true,
      allowVoiceRecording: true,
      dataRetentionDays: 0
    },
    voice: {
      speed: 1.0,
      pitch: 1.0,
      voice: 'friendly-female'
    }
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'child', label: 'Child Profile', icon: <User className="w-5 h-5" /> },
    { id: 'content', label: 'Content & Safety', icon: <Shield className="w-5 h-5" /> },
    { id: 'privacy', label: 'Privacy', icon: <Eye className="w-5 h-5" /> },
    { id: 'voice', label: 'Voice Settings', icon: <Volume2 className="w-5 h-5" /> }
  ]

  const handleStartSession = () => {
    window.location.href = '/story'
  }

  const handleSaveSettings = () => {
    // Save settings to backend
    console.log('Saving settings:', settings)
    // Show success message
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
              {user && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full"
                  />
                  <span>Welcome, {user.name}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleStartSession}
                className="btn-primary flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Story Session
              </button>
              
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="card space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card"
            >
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Heart className="w-6 h-6 text-primary-600" />
                        <h3 className="font-semibold text-primary-900">Active Child</h3>
                      </div>
                      <p className="text-2xl font-bold text-primary-700">{settings.childName}</p>
                      <p className="text-primary-600">Age {settings.childAge}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-6 h-6 text-green-600" />
                        <h3 className="font-semibold text-green-900">Session Limit</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-700">{settings.maxSessionDuration} min</p>
                      <p className="text-green-600">Per session</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <h3 className="font-semibold text-blue-900">Privacy Mode</h3>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        {settings.privacy.saveSessionData ? 'Saving' : 'Private'}
                      </p>
                      <p className="text-blue-600">Data handling</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-2">Ready for Story Time!</h3>
                    <p className="mb-4 opacity-90">
                      {settings.childName} is all set up for a magical storytelling adventure. 
                      Click below to start a new session.
                    </p>
                    <button
                      onClick={handleStartSession}
                      className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start New Story Session
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'child' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Child Profile</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Child's Name
                      </label>
                      <input
                        type="text"
                        value={settings.childName}
                        onChange={(e) => setSettings({...settings, childName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter child's name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <select
                        value={settings.childAge}
                        onChange={(e) => setSettings({...settings, childAge: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {[3,4,5,6,7,8,9,10,11,12].map(age => (
                          <option key={age} value={age}>{age} years old</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Session Duration
                      </label>
                      <select
                        value={settings.maxSessionDuration}
                        onChange={(e) => setSettings({...settings, maxSessionDuration: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Content & Safety Filters</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800">
                        <strong>Note:</strong> All content is pre-filtered for age-appropriateness. 
                        These settings provide additional customization.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(settings.contentFilters).map(([key, enabled]) => (
                        <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900 capitalize">{key} Content</h3>
                            <p className="text-sm text-gray-600">
                              {key === 'violence' && 'Exclude any violent or aggressive themes'}
                              {key === 'scary' && 'Avoid scary or frightening elements'}
                              {key === 'educational' && 'Include learning opportunities and facts'}
                              {key === 'fantasy' && 'Allow magical and fantasy elements'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(e) => setSettings({
                                ...settings,
                                contentFilters: {
                                  ...settings.contentFilters,
                                  [key]: e.target.checked
                                }
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800">
                        <strong>Privacy First:</strong> By default, no session data is saved. 
                        All processing happens locally in your browser when possible.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Save Session Data</h3>
                          <p className="text-sm text-gray-600">
                            Store session transcripts and interactions for review
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.saveSessionData}
                            onChange={(e) => setSettings({
                              ...settings,
                              privacy: {
                                ...settings.privacy,
                                saveSessionData: e.target.checked
                              }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Emotion Detection</h3>
                          <p className="text-sm text-gray-600">
                            Allow camera access for emotion-based story adaptation
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.allowEmotionDetection}
                            onChange={(e) => setSettings({
                              ...settings,
                              privacy: {
                                ...settings.privacy,
                                allowEmotionDetection: e.target.checked
                              }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Voice Recording</h3>
                          <p className="text-sm text-gray-600">
                            Allow microphone access for voice interaction
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.allowVoiceRecording}
                            onChange={(e) => setSettings({
                              ...settings,
                              privacy: {
                                ...settings.privacy,
                                allowVoiceRecording: e.target.checked
                              }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'voice' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Voice Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voice Character
                      </label>
                      <select
                        value={settings.voice.voice}
                        onChange={(e) => setSettings({
                          ...settings,
                          voice: {...settings.voice, voice: e.target.value}
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="friendly-female">Friendly Female</option>
                        <option value="gentle-male">Gentle Male</option>
                        <option value="cheerful-child">Cheerful Child</option>
                        <option value="wise-narrator">Wise Narrator</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Speaking Speed: {settings.voice.speed}x
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={settings.voice.speed}
                        onChange={(e) => setSettings({
                          ...settings,
                          voice: {...settings.voice, speed: parseFloat(e.target.value)}
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Slower</span>
                        <span>Normal</span>
                        <span>Faster</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voice Pitch: {settings.voice.pitch}x
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={settings.voice.pitch}
                        onChange={(e) => setSettings({
                          ...settings,
                          voice: {...settings.voice, pitch: parseFloat(e.target.value)}
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Lower</span>
                        <span>Normal</span>
                        <span>Higher</span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <button className="btn-secondary">
                        <Volume2 className="w-4 h-4 mr-2" />
                        Test Voice Settings
                      </button>
                      <p className="text-sm text-blue-700 mt-2">
                        Click to hear a sample with current settings
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveSettings}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Settings
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentDashboard