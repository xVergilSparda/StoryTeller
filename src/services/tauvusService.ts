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
}

interface TauvusConversation {
  conversation_id: string
  replica_id: string
  status: 'active' | 'ended'
  created_at: string
  participant_count: number
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
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching Tauvus replicas:', error)
      throw new Error('Failed to fetch replicas')
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
      return response.data.data
    } catch (error) {
      console.error('Error creating Tauvus conversation:', error)
      throw new Error('Failed to create conversation')
    }
  }

  // End a conversation
  async endConversation(conversationId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/v2/conversations/${conversationId}`, {
        headers: this.getHeaders()
      })
    } catch (error) {
      console.error('Error ending Tauvus conversation:', error)
      throw new Error('Failed to end conversation')
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
      throw new Error('Failed to fetch transcript')
    }
  }
}

export const tauvusService = new TauvusService()
export type { TauvusReplica, TauvusConversation, ConversationRequest }