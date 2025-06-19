import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Clock, Star, BookOpen, Lightbulb, Heart, Moon } from 'lucide-react'
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: 'All Stories', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'adventure', label: 'Adventure', icon: <Star className="w-5 h-5" /> },
    { id: 'educational', label: 'Learning', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'moral', label: 'Life Lessons', icon: <Heart className="w-5 h-5" /> },
    { id: 'bedtime', label: 'Bedtime', icon: <Moon className="w-5 h-5" /> }
  ]

  useEffect(() => {
    loadStoriesAndReplicas()
  }, [childAge])

  const loadStoriesAndReplicas = async () => {
    try {
      setLoading(true)
      
      // Load story templates based on child's age
      const ageAppropriateTemplates = storyService.getTemplatesByAge(childAge)
      setTemplates(ageAppropriateTemplates)
      
      // Load available Tauvus replicas
      const availableReplicas = await tauvusService.getReplicas()
      setReplicas(availableReplicas)
      
      setLoading(false)
    } catch (err) {
      setError('Failed to load stories. Please try again.')
      setLoading(false)
    }
  }

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  const handleStorySelect = (template: StoryTemplate) => {
    // For now, use the first available replica
    // Later we can implement replica selection based on story type
    const selectedReplica = replicas[0]
    if (selectedReplica) {
      onStorySelect(template, selectedReplica)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
        <div className="text-center child-interface">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Loading Stories...
          </h2>
          <p className="text-gray-600">
            Finding the perfect adventures for you!
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-pink-100">
        <div className="text-center child-interface">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={loadStoriesAndReplicas}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 child-interface"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Choose Your Story! 📚
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 child-interface"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Pick an adventure that sounds exciting to you!
          </motion.p>
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
              className="child-card cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => handleStorySelect(template)}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-4">
                  {template.category === 'adventure' && '🌟'}
                  {template.category === 'educational' && '🧠'}
                  {template.category === 'moral' && '❤️'}
                  {template.category === 'bedtime' && '🌙'}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 child-interface">
                  {template.title}
                </h3>
                <p className="text-gray-600 child-interface mb-4">
                  {template.description}
                </p>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {template.estimatedDuration} min
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Ages {template.ageRange[0]}-{template.ageRange[1]}
                </div>
              </div>

              <div className="flex justify-center">
                <button className="btn-primary flex items-center gap-2 child-interface">
                  <Play className="w-4 h-4" />
                  Start Story
                </button>
              </div>

              {template.moralLesson && (
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-700 child-interface">
                    <strong>Learn:</strong> {template.moralLesson}
                  </p>
                </div>
              )}

              {template.educationalContent && (
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-700 child-interface">
                    <strong>Topics:</strong> {template.educationalContent.join(', ')}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2 child-interface">
              No stories found
            </h3>
            <p className="text-gray-500 child-interface">
              Try selecting a different category!
            </p>
          </div>
        )}

        {/* Replica Status */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            {replicas.length > 0 
              ? `${replicas.length} storyteller${replicas.length > 1 ? 's' : ''} ready to tell stories!`
              : 'Loading storytellers...'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default StorySelection