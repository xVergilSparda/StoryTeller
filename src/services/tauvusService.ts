import axios from 'axios'

const TAUVUS_API_KEY = '97eb0fcb26fa46b19f7f076c324d3af7'
const TAUVUS_BASE_URL = 'https://tavusapi.com'

interface TauvusReplica {
  replica_id: string
  replica_name: string
  status: string
  created_at: string
  updated_at: string
  callback_url?: string
  persona?: {
    personality: string
    voice_style: string
    speaking_style: string
  }
}

interface TauvusConversation {
  conversation_id: string
  replica_id: string
  status: 'active' | 'ended'
  created_at: string
  participant_count: number
  conversation_url?: string
}

interface ConversationRequest {
  replica_id: string
  conversation_name?: string
  callback_url?: string
  properties?: {
    max_call_duration?: number
    participant_left_timeout?: number
    participant_absent_timeout?: number
    enable_recording?: boolean
    enable_transcription?: boolean
  }
}

class TauvusService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = TAUVUS_API_KEY
    this.baseUrl = TAUVUS_BASE_URL
  }

  private getHeaders() {
    return {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json'
    }
  }

  // Discover existing replicas
  async getReplicas(): Promise<TauvusReplica[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/v2/replicas`, {
        headers: this.getHeaders()
      })
      
      console.log('Tauvus replicas discovered:', response.data)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching Tauvus replicas:', error)
      
      // Return mock replicas for development if API fails
      return [
        {
          replica_id: 'mock-storyteller-1',
          replica_name: 'Friendly Fox',
          status: 'ready',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          persona: {
            personality: 'Warm, encouraging, and playful. Loves adventure stories and helping children learn.',
            voice_style: 'Gentle and animated',
            speaking_style: 'Uses simple language, asks engaging questions, and adapts to child\'s emotional state'
          }
        },
        {
          replica_id: 'mock-storyteller-2',
          replica_name: 'Wise Owl',
          status: 'ready',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          persona: {
            personality: 'Calm, wise, and educational. Perfect for bedtime stories and learning adventures.',
            voice_style: 'Soothing and measured',
            speaking_style: 'Patient explanations, gentle guidance, and calming presence'
          }
        }
      ]
    }
  }

  // Create a new conversation with a replica
  async createConversation(request: ConversationRequest): Promise<TauvusConversation> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v2/conversations`,
        {
          replica_id: request.replica_id,
          conversation_name: request.conversation_name || 'StoryTeller Session',
          callback_url: request.callback_url,
          properties: {
            max_call_duration: 600, // 10 minutes
            participant_left_timeout: 30,
            participant_absent_timeout: 60,
            enable_recording: true,
            enable_transcription: true,
            ...request.properties
          }
        },
        {
          headers: this.getHeaders()
        }
      )
      
      console.log('Tauvus conversation created:', response.data)
      return response.data.data
    } catch (error) {
      console.error('Error creating Tauvus conversation:', error)
      
      // Return mock conversation for development
      return {
        conversation_id: `mock-conv-${Date.now()}`,
        replica_id: request.replica_id,
        status: 'active',
        created_at: new Date().toISOString(),
        participant_count: 1,
        conversation_url: `https://mock-tauvus-url.com/conversation/${Date.now()}`
      }
    }
  }

  // End a conversation
  async endConversation(conversationId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/v2/conversations/${conversationId}`, {
        headers: this.getHeaders()
      })
      console.log('Conversation ended:', conversationId)
    } catch (error) {
      console.error('Error ending Tauvus conversation:', error)
      // Don't throw error for mock conversations
      if (!conversationId.startsWith('mock-conv-')) {
        throw new Error('Failed to end conversation')
      }
    }
  }

  // Get conversation details
  async getConversation(conversationId: string): Promise<TauvusConversation> {
    try {
      const response = await axios.get(`${this.baseUrl}/v2/conversations/${conversationId}`, {
        headers: this.getHeaders()
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching conversation:', error)
      throw new Error('Failed to fetch conversation')
    }
  }

  // Get conversation transcript (for safety monitoring)
  async getConversationTranscript(conversationId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/v2/conversations/${conversationId}/transcript`, {
        headers: this.getHeaders()
      })
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching transcript:', error)
      return [] // Return empty array for development
    }
  }

  // Send message to conversation (for dynamic storytelling)
  async sendMessage(conversationId: string, message: string): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/v2/conversations/${conversationId}/messages`,
        { message },
        { headers: this.getHeaders() }
      )
    } catch (error) {
      console.error('Error sending message to conversation:', error)
      // Don't throw for mock conversations
      if (!conversationId.startsWith('mock-conv-')) {
        throw new Error('Failed to send message')
      }
    }
  }
}

export const tauvusService = new TauvusService()
export type { TauvusReplica, TauvusConversation, ConversationRequest }