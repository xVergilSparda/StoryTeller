import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Clock, Star, BookOpen, Lightbulb, Heart, Moon, Zap } from 'lucide-react'
import { storyService, type StoryTemplate } from '../services/storyService'
import { tauvusService, type TauvusReplica } from '../services/tauvusService'

interface StorySelectionProps {
  childAge: number
  onStorySelect: (template: StoryTemplate, replica: TauvusReplica) => void
}

const StorySelection: React.FC<StorySelectionProps> = ({ childAge, onStorySelect }) => {
  const [templates, setTemplates] = useState<StoryTemplate[]>([])
  const [replicas, setReplicas] = useState<TauvusReplica[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<'all' | 'static' | 'dynamic'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: 'All Stories', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'adventure', label: 'Adventure', icon: <Star className="w-5 h-5" /> },
    { id: 'educational', label: 'Learning', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'moral', label: 'Life Lessons', icon: <Heart className="w-5 h-5" /> },
    { id: 'bedtime', label: 'Bedtime', icon: <Moon className="w-5 h-5" /> }
  ]

  const storyTypes = [
    { id: 'all', label: 'All Types', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'static', label: 'Classic Stories', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'dynamic', label: 'Interactive', icon: <Zap className="w-4 h-4" /> }
  ]

  useEffect(() => {
    loadStoriesAndReplicas()
  }, [childAge])

  const loadStoriesAndReplicas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load story templates based on child's age
      const ageAppropriateTemplates = storyService.getTemplatesByAge(childAge)
      setTemplates(ageAppropriateTemplates)
      
      // Load available Tauvus replicas
      const availableReplicas = await tauvusService.getReplicas()
      setReplicas(availableReplicas)
      
      console.log('Loaded templates:', ageAppropriateTemplates)
      console.log('Loaded replicas:', availableReplicas)
      
      setLoading(false)
    } catch (err) {
      console.error('Error loading stories and replicas:', err)
      setError('Failed to load stories. Please try again.')
      setLoading(false)
    }
  }

  const getFilteredTemplates = () => {
    let filtered = templates

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    // Filter by story type
    if (selectedType !== 'all') {
      filtered = filtered.filter(template => template.storyType === selectedType)
    }

    return filtered
  }

  const getReplicaForTemplate = (template: StoryTemplate): TauvusReplica => {
    // Try to match replica based on template preference
    if (template.replicaPreference && replicas.length > 0) {
      const preferredReplica = replicas.find(replica => 
        replica.replica_name.toLowerCase().includes(template.replicaPreference!) ||
        replica.persona?.personality.toLowerCase().includes(template.replicaPreference!)
      )
      if (preferredReplica) return preferredReplica
    }

    // Fallback to first available replica
    return replicas[0] || {
      replica_id: 'fallback-replica',
      replica_name: 'StoryTeller',
      status: 'ready',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  const handleStorySelect = (template: StoryTemplate) => {
    const selectedReplica = getReplicaForTemplate(template)
    console.log('Selected story:', template.title, 'with replica:', selectedReplica.replica_name)
    onStorySelect(template, selectedReplica)
  }

  const getStoryTypeIcon = (storyType: string) => {
    switch (storyType) {
      case 'static':
        return '📖'
      case 'dynamic':
        return '🎮'
      default:
        return '📚'
    }
  }

  const getStoryTypeDescription = (storyType: string) => {
    switch (storyType) {
      case 'static':
        return 'Classic storytelling - sit back and enjoy!'
      case 'dynamic':
        return 'Interactive story - you help decide what happens!'
      default:
        return 'Story adventure'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
        <div className="text-center child-interface">
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="text-3xl">📚</div>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Loading Your Stories...
          </h2>
          <p className="text-gray-600 text-lg">
            Finding the perfect adventures for you!
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Discovering Tauvus storytellers...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-pink-100">
        <div className="text-center child-interface">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-red-500 mb-6 text-lg">{error}</p>
          <button
            onClick={loadStoriesAndReplicas}
            className="btn-primary text-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const filteredTemplates = getFilteredTemplates()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 child-interface"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Choose Your Story! 📚
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-600 child-interface mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Pick an adventure that sounds exciting to you!
          </motion.p>
          
          {replicas.length > 0 && (
            <motion.div
              className="bg-green-100 border border-green-300 rounded-xl p-4 max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-green-700 font-medium child-interface">
                🎭 {replicas.length} storyteller{replicas.length > 1 ? 's' : ''} ready to tell stories!
              </p>
            </motion.div>
          )}
        </div>

        {/* Story Type Filter */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            <div className="flex gap-2">
              {storyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all child-interface ${
                    selectedType === type.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-primary-100'
                  }`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all child-interface ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-primary-100 shadow-md'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.icon}
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Story Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              className="child-card cursor-pointer relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => handleStorySelect(template)}
            >
              {/* Story Type Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  template.storyType === 'dynamic' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {getStoryTypeIcon(template.storyType)} {template.storyType === 'dynamic' ? 'Interactive' : 'Classic'}
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-6xl mb-4">
                  {template.category === 'adventure' && '🌟'}
                  {template.category === 'educational' && '🧠'}
                  {template.category === 'moral' && '❤️'}
                  {template.category === 'bedtime' && '🌙'}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 child-interface">
                  {template.title}
                </h3>
                <p className="text-gray-600 child-interface mb-4 text-lg">
                  {template.description}
                </p>
                <p className="text-sm text-gray-500 child-interface">
                  {getStoryTypeDescription(template.storyType)}
                </p>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {template.estimatedDuration} min
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Ages {template.ageRange[0]}-{template.ageRange[1]}
                </div>
              </div>

              <div className="flex justify-center mb-4">
                <button className="btn-primary flex items-center gap-2 child-interface text-lg">
                  <Play className="w-5 h-5" />
                  Start Story
                </button>
              </div>

              {template.moralLesson && (
                <div className="mb-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-700 child-interface">
                    <strong>Learn:</strong> {template.moralLesson}
                  </p>
                </div>
              )}

              {template.educationalContent && (
                <div className="p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-700 child-interface">
                    <strong>Topics:</strong> {template.educationalContent.join(', ')}
                  </p>
                </div>
              )}

              {/* Replica Info */}
              <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                <p className="text-sm text-purple-700 child-interface">
                  <strong>Storyteller:</strong> {getReplicaForTemplate(template).replica_name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-8xl mb-6">😔</div>
            <h3 className="text-3xl font-bold text-gray-600 mb-4 child-interface">
              No stories found
            </h3>
            <p className="text-gray-500 child-interface text-lg mb-6">
              Try selecting a different category or story type!
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedType('all')
              }}
              className="btn-secondary child-interface"
            >
              Show All Stories
            </button>
          </div>
        )}

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
            <p><strong>Debug Info:</strong></p>
            <p>Total templates: {templates.length}</p>
            <p>Filtered templates: {filteredTemplates.length}</p>
            <p>Available replicas: {replicas.length}</p>
            <p>Selected category: {selectedCategory}</p>
            <p>Selected type: {selectedType}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StorySelection