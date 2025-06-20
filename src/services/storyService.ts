import type { SafetyAlert } from '../types'

interface StoryMilestone {
  id: string
  title: string
  description: string
  isRequired: boolean
  emotionalTriggers: string[]
  adaptations: {
    scared: string
    bored: string
    confused: string
    excited: string
    neutral: string
  }
  choices?: StoryChoice[]
}

interface StoryChoice {
  id: string
  text: string
  consequence: string
  nextMilestone?: string
}

interface StoryTemplate {
  id: string
  title: string
  category: 'adventure' | 'educational' | 'moral' | 'bedtime'
  ageRange: [number, number]
  description: string
  estimatedDuration: number
  difficulty: 'simple' | 'intermediate' | 'advanced'
  storyType: 'static' | 'dynamic'
  milestones: StoryMilestone[]
  characters: string[]
  settings: string[]
  moralLesson?: string
  educationalContent?: string[]
  replicaPreference?: string // Preferred replica type
}

class StoryService {
  private templates: StoryTemplate[] = []
  private safetyKeywords: string[] = [
    'hurt', 'pain', 'scared', 'afraid', 'sad', 'angry', 'hate', 'kill', 'die', 'blood',
    'weapon', 'gun', 'knife', 'fight', 'violence', 'abuse', 'inappropriate', 'secret',
    'don\'t tell', 'private parts', 'touch', 'uncomfortable', 'stranger', 'alone'
  ]

  private positiveKeywords: string[] = [
    'happy', 'fun', 'excited', 'love', 'friend', 'help', 'kind', 'brave', 'smart',
    'adventure', 'magic', 'wonderful', 'amazing', 'beautiful', 'safe'
  ]

  constructor() {
    this.initializeTemplates()
  }

  private initializeTemplates() {
    this.templates = [
      {
        id: 'forest-adventure-static',
        title: 'The Magical Forest Adventure',
        category: 'adventure',
        ageRange: [4, 8],
        description: 'Join a friendly fox on an adventure through an enchanted forest',
        estimatedDuration: 8,
        difficulty: 'simple',
        storyType: 'static',
        replicaPreference: 'friendly',
        milestones: [
          {
            id: 'forest-entry',
            title: 'Welcome to the Forest',
            description: 'Once upon a time, there was a magical forest where friendly animals lived...',
            isRequired: true,
            emotionalTriggers: ['curiosity', 'excitement'],
            adaptations: {
              scared: 'This forest is the safest, most beautiful place with colorful flowers and gentle sunshine everywhere.',
              bored: 'Suddenly, sparkles appear in the air and you hear the most amazing magical sounds!',
              confused: 'Let me tell you about this wonderful forest step by step, it\'s really simple and fun.',
              excited: 'What an incredible adventure awaits us in this absolutely magical place!',
              neutral: 'Welcome to our magical forest, where every tree has a story to tell.'
            }
          },
          {
            id: 'meet-fox',
            title: 'Meeting the Fox',
            description: 'A friendly fox with a bushy red tail appears and wants to be your friend...',
            isRequired: true,
            emotionalTriggers: ['friendship', 'trust'],
            adaptations: {
              scared: 'The fox has the kindest eyes and the gentlest smile. He just wants to be your friend.',
              bored: 'The fox does a funny little dance and tells the most amazing jokes!',
              confused: 'The fox speaks slowly and clearly, making sure you understand everything.',
              excited: 'The fox is just as excited as you are and can\'t wait to show you around!',
              neutral: 'The fox introduces himself politely and asks if you\'d like to explore together.'
            }
          },
          {
            id: 'forest-exploration',
            title: 'Exploring Together',
            description: 'You and the fox discover beautiful flowers, singing birds, and sparkling streams...',
            isRequired: false,
            emotionalTriggers: ['wonder', 'discovery'],
            adaptations: {
              scared: 'Everything you see is peaceful and safe, like a beautiful garden.',
              bored: 'You discover a hidden treasure chest filled with magical surprises!',
              confused: 'The fox explains each wonderful thing you see in simple, easy words.',
              excited: 'Every step reveals something more amazing than the last!',
              neutral: 'Together you explore the forest\'s many wonders at a comfortable pace.'
            }
          },
          {
            id: 'story-conclusion',
            title: 'A Perfect Ending',
            description: 'Your adventure ends with new friendship and wonderful memories...',
            isRequired: true,
            emotionalTriggers: ['satisfaction', 'accomplishment'],
            adaptations: {
              scared: 'You feel completely safe and happy, knowing you\'ve made a wonderful friend.',
              bored: 'What an absolutely incredible adventure you\'ve just completed!',
              confused: 'You did such a great job exploring and learning new things.',
              excited: 'That was the most amazing forest adventure anyone could ever have!',
              neutral: 'You and the fox have become great friends and had a lovely time together.'
            }
          }
        ],
        characters: ['friendly-fox'],
        settings: ['enchanted-forest'],
        moralLesson: 'Friendship and kindness make every adventure better'
      },
      {
        id: 'counting-adventure-dynamic',
        title: 'The Counting Treasure Hunt',
        category: 'educational',
        ageRange: [3, 6],
        description: 'Learn numbers while searching for magical treasures with a wise owl',
        estimatedDuration: 10,
        difficulty: 'simple',
        storyType: 'dynamic',
        replicaPreference: 'wise',
        milestones: [
          {
            id: 'treasure-start',
            title: 'The Treasure Map',
            description: 'A wise owl shows you a magical treasure map with numbers...',
            isRequired: true,
            emotionalTriggers: ['learning', 'excitement'],
            adaptations: {
              scared: 'This is a fun, safe treasure hunt with your wise owl friend helping you.',
              bored: 'The treasure map glows with magical colors and shows amazing prizes!',
              confused: 'We\'ll count slowly together, one number at a time, nice and easy.',
              excited: 'You\'re going to be the best treasure hunter ever!',
              neutral: 'Let\'s start our counting adventure with the number one.'
            },
            choices: [
              {
                id: 'start-counting',
                text: 'Start with number 1',
                consequence: 'Great choice! Let\'s find our first treasure.',
                nextMilestone: 'find-treasure-1'
              },
              {
                id: 'learn-about-map',
                text: 'Tell me about the map',
                consequence: 'The map shows magical places where treasures are hidden!',
                nextMilestone: 'find-treasure-1'
              }
            ]
          },
          {
            id: 'find-treasure-1',
            title: 'Finding Treasure One',
            description: 'You find your first treasure - one beautiful golden star!',
            isRequired: true,
            emotionalTriggers: ['achievement', 'counting'],
            adaptations: {
              scared: 'Look! One beautiful, safe golden star that sparkles gently.',
              bored: 'Wow! One amazing magical star that grants wishes!',
              confused: 'This is the number one - just one single, beautiful star.',
              excited: 'One incredible treasure found! You\'re doing amazingly!',
              neutral: 'Excellent! You found treasure number one.'
            },
            choices: [
              {
                id: 'continue-to-two',
                text: 'Look for treasure number 2',
                consequence: 'Let\'s find two treasures next!',
                nextMilestone: 'find-treasure-2'
              },
              {
                id: 'examine-star',
                text: 'Look at the star closely',
                consequence: 'The star sparkles with magical light!',
                nextMilestone: 'find-treasure-2'
              }
            ]
          },
          {
            id: 'find-treasure-2',
            title: 'Finding Treasure Two',
            description: 'Now you discover two shiny silver coins!',
            isRequired: true,
            emotionalTriggers: ['counting', 'pattern-recognition'],
            adaptations: {
              scared: 'Two gentle, shiny coins that make a soft, pleasant sound.',
              bored: 'Two magical coins that can buy anything in the fairy kingdom!',
              confused: 'Count with me: one coin, two coins. That\'s the number two!',
              excited: 'Two fantastic treasures! You\'re the best treasure hunter!',
              neutral: 'Perfect! Now you have found two treasures.'
            }
          }
        ],
        characters: ['wise-owl'],
        settings: ['treasure-island'],
        educationalContent: ['numbers', 'counting', 'basic-math'],
        moralLesson: 'Learning is fun when we take it step by step'
      },
      {
        id: 'bedtime-stars',
        title: 'The Sleepy Star\'s Lullaby',
        category: 'bedtime',
        ageRange: [3, 7],
        description: 'A gentle story about stars going to sleep in the sky',
        estimatedDuration: 6,
        difficulty: 'simple',
        storyType: 'static',
        replicaPreference: 'calm',
        milestones: [
          {
            id: 'evening-sky',
            title: 'The Evening Sky',
            description: 'As the sun sets, the stars begin to twinkle in the peaceful sky...',
            isRequired: true,
            emotionalTriggers: ['calm', 'sleepy'],
            adaptations: {
              scared: 'The sky is warm and safe, like a cozy blanket covering the world.',
              bored: 'The stars dance gently and sing the softest, most beautiful songs.',
              confused: 'The stars are getting ready for bed, just like you do every night.',
              excited: 'Even the stars know it\'s time to rest and have sweet dreams.',
              neutral: 'The evening sky grows dark and peaceful as bedtime approaches.'
            }
          },
          {
            id: 'sleepy-star',
            title: 'The Sleepy Star',
            description: 'One little star yawns and gets ready to sleep...',
            isRequired: true,
            emotionalTriggers: ['sleepiness', 'comfort'],
            adaptations: {
              scared: 'The little star feels completely safe and loved in the sky.',
              bored: 'The star wraps itself in the softest cloud blanket.',
              confused: 'Just like you, the star brushes its teeth and gets ready for bed.',
              excited: 'The star is excited for all the wonderful dreams it will have.',
              neutral: 'The little star settles down for a peaceful night\'s sleep.'
            }
          }
        ],
        characters: ['sleepy-star'],
        settings: ['night-sky'],
        moralLesson: 'Rest is important and bedtime can be peaceful and comforting'
      }
    ]
  }

  getTemplatesByCategory(category: string): StoryTemplate[] {
    if (category === 'all') return this.templates
    return this.templates.filter(template => template.category === category)
  }

  getTemplatesByAge(age: number): StoryTemplate[] {
    return this.templates.filter(template => 
      age >= template.ageRange[0] && age <= template.ageRange[1]
    )
  }

  getTemplate(id: string): StoryTemplate | null {
    return this.templates.find(template => template.id === id) || null
  }

  getTemplatesByType(storyType: 'static' | 'dynamic'): StoryTemplate[] {
    return this.templates.filter(template => template.storyType === storyType)
  }

  // Enhanced safety analysis with sentiment detection
  analyzeSafety(text: string): SafetyAlert | null {
    const lowerText = text.toLowerCase()
    const foundKeywords = this.safetyKeywords.filter(keyword => 
      lowerText.includes(keyword)
    )

    if (foundKeywords.length > 0) {
      const highRiskKeywords = ['hurt', 'pain', 'kill', 'die', 'blood', 'weapon', 'gun', 'knife', 'abuse']
      const isHighRisk = foundKeywords.some(k => highRiskKeywords.includes(k))
      
      return {
        level: isHighRisk ? 'high' : 'medium',
        keywords: foundKeywords,
        message: text,
        timestamp: new Date(),
        context: 'child-input'
      }
    }

    // Check for concerning patterns
    const concerningPatterns = [
      /don'?t tell/i,
      /keep.*secret/i,
      /our.*secret/i,
      /touch.*private/i,
      /uncomfortable/i
    ]

    for (const pattern of concerningPatterns) {
      if (pattern.test(text)) {
        return {
          level: 'high',
          keywords: ['concerning-pattern'],
          message: text,
          timestamp: new Date(),
          context: 'child-input'
        }
      }
    }

    return null
  }

  // Adapt story content based on emotional state
  adaptStoryContent(
    milestone: StoryMilestone, 
    emotionalState: 'scared' | 'bored' | 'confused' | 'excited' | 'neutral'
  ): string {
    return milestone.adaptations[emotionalState] || milestone.adaptations.neutral
  }

  // Generate story response for dynamic stories
  generateStoryResponse(
    template: StoryTemplate,
    currentMilestone: string,
    childInput: string,
    emotionalState: string
  ): {
    response: string
    nextMilestone?: string
    shouldContinue: boolean
    safetyAlert?: SafetyAlert
    choices?: StoryChoice[]
  } {
    const safetyAlert = this.analyzeSafety(childInput)
    
    if (safetyAlert && safetyAlert.level === 'high') {
      return {
        response: "That's an interesting thought! Let's focus on our wonderful story instead. What would you like to see happen next in our adventure?",
        shouldContinue: true,
        safetyAlert
      }
    }

    const milestone = template.milestones.find(m => m.id === currentMilestone)
    if (!milestone) {
      return {
        response: "Let's continue with our amazing story!",
        shouldContinue: true
      }
    }

    const adaptedContent = this.adaptStoryContent(
      milestone, 
      emotionalState as any
    )

    // Find next milestone
    const currentIndex = template.milestones.findIndex(m => m.id === currentMilestone)
    const nextMilestone = currentIndex < template.milestones.length - 1 
      ? template.milestones[currentIndex + 1].id 
      : undefined

    // For dynamic stories, include choices if available
    const choices = template.storyType === 'dynamic' ? milestone.choices : undefined

    return {
      response: adaptedContent,
      nextMilestone,
      shouldContinue: !!nextMilestone,
      safetyAlert,
      choices
    }
  }

  // Generate contextual response to child's input
  generateContextualResponse(childInput: string, template: StoryTemplate): string {
    const lowerInput = childInput.toLowerCase()
    
    // Positive reinforcement for good engagement
    const positiveWords = this.positiveKeywords.filter(word => lowerInput.includes(word))
    if (positiveWords.length > 0) {
      return `I love that you mentioned ${positiveWords[0]}! That's exactly the spirit of our story. Let's see what happens next...`
    }

    // Handle questions
    if (lowerInput.includes('what') || lowerInput.includes('why') || lowerInput.includes('how')) {
      return "That's a great question! Let me show you what happens next in our story..."
    }

    // Handle expressions of emotion
    if (lowerInput.includes('scared') || lowerInput.includes('afraid')) {
      return "Don't worry, everything in our story is safe and friendly. Let's continue with something gentle and fun..."
    }

    if (lowerInput.includes('boring') || lowerInput.includes('tired')) {
      return "Let's make this more exciting! Something amazing is about to happen..."
    }

    // Default encouraging response
    return "I hear you! Let's see what our story characters do next..."
  }
}

export const storyService = new StoryService()
export type { StoryTemplate, StoryMilestone, StoryChoice }