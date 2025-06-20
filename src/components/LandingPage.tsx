import React from 'react'
import { motion } from 'framer-motion'
import { useAuth0 } from '@auth0/auth0-react'
import { Play, Shield, Heart, Sparkles, Users, Settings } from 'lucide-react'

const LandingPage: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0()

  const features = [
    {
      icon: <Play className="w-8 h-8" />,
      title: "Interactive Stories",
      description: "AI-powered characters that respond to your child's emotions and voice"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe & Secure",
      description: "COPPA compliant with full parental control over data and content"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Emotionally Aware",
      description: "Stories adapt in real-time based on your child's facial expressions"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Magical Experience",
      description: "3D avatars and immersive environments that captivate young minds"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ed5fff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 child-interface"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                StoryTeller
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto child-interface"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Where AI meets imagination. Interactive storytelling that adapts to your child's emotions and voice.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => loginWithRedirect()}
                    className="btn-primary text-lg px-8 py-4 flex items-center gap-3"
                  >
                    <Users className="w-5 h-5" />
                    Parent Login
                  </button>
                  <button
                    onClick={() => window.location.href = '/story'}
                    className="btn-secondary text-lg px-8 py-4 flex items-center gap-3"
                  >
                    <Play className="w-5 h-5" />
                    Try Demo Story
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="btn-primary text-lg px-8 py-4 flex items-center gap-3"
                  >
                    <Settings className="w-5 h-5" />
                    Parent Dashboard
                  </button>
                  <button
                    onClick={() => window.location.href = '/story'}
                    className="btn-secondary text-lg px-8 py-4 flex items-center gap-3"
                  >
                    <Play className="w-5 h-5" />
                    Start Story
                  </button>
                </>
              )}
            </motion.div>
            
            {isAuthenticated && user && (
              <motion.p
                className="mt-4 text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Welcome back, {user.name}!
              </motion.p>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Magical Storytelling Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powered by cutting-edge AI technology, designed with children's safety and engagement in mind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="child-card text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-primary-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 child-interface">
                  {feature.title}
                </h3>
                <p className="text-gray-600 child-interface">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Shield className="w-8 h-8 text-green-600" />
            </motion.div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Safety First, Always
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="card">
                  <h3 className="font-bold text-lg mb-3 text-green-700">COPPA Compliant</h3>
                  <p className="text-gray-600">
                    Full compliance with children's privacy laws. No data collection without explicit parental consent.
                  </p>
                </div>
                <div className="card">
                  <h3 className="font-bold text-lg mb-3 text-blue-700">Parental Control</h3>
                  <p className="text-gray-600">
                    Complete control over content, session duration, data storage, and privacy settings.
                  </p>
                </div>
                <div className="card">
                  <h3 className="font-bold text-lg mb-3 text-purple-700">Secure by Design</h3>
                  <p className="text-gray-600">
                    End-to-end encryption, secure authentication, and no permanent data storage by default.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 child-interface">StoryTeller</h3>
            <p className="text-gray-400 mb-6">
              Creating magical, safe, and educational storytelling experiences for children worldwide.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              © 2025 StoryTeller. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage