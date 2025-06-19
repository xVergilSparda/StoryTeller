import type { StoryTemplate, StorySession, SafetyAlert } from '../types'

interface StoryMilestone {
  id: string
  title: string
  description: string
  isRequired: boolean // Hard vs soft milestone
  emotionalTriggers: string[]
  adaptations: {
    scared: string
    bored: string
    confused: string
    excited: string
  }
}

interface StoryTemplate {
  id: string
  title: string
  category: 'adventure' | 'educational' | 'moral' | 'bedtime'
  ageRange: [number, number]
  description: string
  estimatedDuration: number // minutes
  difficulty: 'simple' | 'intermediate' | 'advanced'
  milestones: StoryMilestone[]
  characters: string[]
  settings: string[]
  moralLesson?: string
  educationalContent?: string[]
}

class StoryService {
  private templates: StoryTemplate[] = []
  private safetyKeywords: string[] = [
    'hurt', 'pain', 'scared', 'afraid', 'sad', 'angry', 'hate', 'kill', 'die', 'blood',
    'weapon', 'gun', 'knife', 'fight', 'violence', 'abuse', 'inappropriate', 'secret',
    'don\'t tell', 'private parts', 'touch', 'uncomfortable'
  ]

  constructor() {
    this.initializeTemplates()
  }

  private initializeTemplates() {
    // Sample story templates
    this.templates = [
      {
        id: 'forest-adventure',
        title: 'The Magical Forest Adventure',
        category: 'adventure',
        ageRange: [4, 8],
        description: 'Join a friendly fox on an adventure through an enchanted forest',
        estimatedDuration: 8,
        difficulty: 'simple',
        milestones: [
          {
            id: 'forest-entry',
            title: 'Entering the Forest',
            description: 'The child meets the fox character and enters the magical forest',
            isRequired: true,
            emotionalTriggers: ['curiosity', 'excitement'],
            adaptations: {
              scared: 'The forest looks very friendly and safe, with colorful flowers everywhere',
              bored: 'Suddenly, sparkles appear in the air and magical sounds fill the forest',
              confused: 'Let me show you around this beautiful, safe forest step by step',
              excited: 'What an amazing adventure awaits us in this magical place!'
            }
          },
          {
            id: 'first-challenge',
            title: 'The Friendly Challenge',
            description: 'A simple puzzle or choice that moves the story forward',
            isRequired: false,
            emotionalTriggers: ['problem-solving', 'confidence'],
            adaptations: {
              scared: 'This is just a fun game, nothing scary at all',
              bored: 'Here comes an exciting puzzle that needs your help',
              confused: 'Let me explain this step by step, it\'s really simple',
              excited: 'You\'re so smart! This challenge will be perfect for you'
            }
          },
          {
            id: 'story-resolution',
            title: 'Happy Ending',
            description: 'The adventure concludes with a positive, satisfying ending',
            isRequired: true,
            emotionalTriggers: ['satisfaction', 'accomplishment'],
            adaptations: {
              scared: 'Everything worked out perfectly and everyone is safe and happy',
              bored: 'What an incredible adventure we just had together!',
              confused: 'You did such a great job helping solve everything',
              excited: 'That was the most amazing adventure ever!'
            }
          }
        ],
        characters: ['friendly-fox'],
        settings: ['enchanted-forest'],
        moralLesson: 'Friendship and helping others'
      },
      {
        id: 'counting-adventure',
        title: 'The Counting Treasure Hunt',
        category: 'educational',
        ageRange: [3, 6],
        description: 'Learn numbers while searching for magical treasures',
        estimatedDuration: 6,
        difficulty: 'simple',
        milestones: [
          {
            id: 'treasure-start',
            title: 'Starting the Hunt',
            description: 'Introduction to counting and the treasure hunt concept',
            isRequired: true,
            emotionalTriggers: ['learning', 'excitement'],
            adaptations: {
              scared: 'This is a fun, safe treasure hunt with friendly helpers',
              bored: 'Let\'s find amazing treasures by counting together!',
              confused: 'We\'ll count slowly, one number at a time',
              excited: 'You\'re going to be the best treasure hunter ever!'
            }
          }
        ],
        characters: ['wise-owl'],
        settings: ['treasure-island'],
        educationalContent: ['numbers', 'counting', 'basic-math']
      }
    ]
  }

  getTemplatesByCategory(category: string): StoryTemplate[] {
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

  // Analyze child's input for safety concerns
  analyzeSafety(text: string): SafetyAlert | null {
    const lowerText = text.toLowerCase()
    const foundKeywords = this.safetyKeywords.filter(keyword => 
      lowerText.includes(keyword)
    )

    if (foundKeywords.length > 0) {
      return {
        level: foundKeywords.some(k => ['hurt', 'pain', 'kill', 'die', 'blood', 'weapon'].includes(k)) 
          ? 'high' : 'medium',
        keywords: foundKeywords,
        message: text,
        timestamp: new Date(),
        context: 'child-input'
      }
    }

    // Sentiment analysis could be added here
    return null
  }

  // Adapt story content based on child's emotional state
  adaptStoryContent(
    milestone: StoryMilestone, 
    emotionalState: 'scared' | 'bored' | 'confused' | 'excited' | 'neutral'
  ): string {
    if (emotionalState === 'neutral') {
      return milestone.description
    }
    return milestone.adaptations[emotionalState] || milestone.description
  }

  // Generate story progression based on child interaction
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
  } {
    const safetyAlert = this.analyzeSafety(childInput)
    
    if (safetyAlert && safetyAlert.level === 'high') {
      return {
        response: "That's an interesting thought! Let's focus on our fun story instead. What do you think our character should do next?",
        shouldContinue: true,
        safetyAlert
      }
    }

    const milestone = template.milestones.find(m => m.id === currentMilestone)
    if (!milestone) {
      return {
        response: "Let's continue with our wonderful story!",
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

    return {
      response: adaptedContent,
      nextMilestone,
      shouldContinue: !!nextMilestone,
      safetyAlert
    }
  }
}

export const storyService = new StoryService()
export type { StoryTemplate, StoryMilestone }