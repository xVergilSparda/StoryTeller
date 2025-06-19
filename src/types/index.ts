// Core application types

export interface User {
  id: string
  email: string
  name: string
  picture?: string
  role: 'parent' | 'child'
  preferences: UserPreferences
}

export interface UserPreferences {
  childName: string
  childAge: number
  contentFilters: ContentFilter[]
  voiceSettings: VoiceSettings
  privacySettings: PrivacySettings
  sessionSettings: SessionSettings
}

export interface ContentFilter {
  type: 'violence' | 'scary' | 'educational' | 'fantasy' | 'adventure'
  enabled: boolean
  level: 'none' | 'mild' | 'moderate' | 'strict'
}

export interface VoiceSettings {
  speed: number // 0.5 to 2.0
  pitch: number // 0.5 to 2.0
  voice: string // voice ID from PlayHT
  language: string
}

export interface PrivacySettings {
  saveSessionData: boolean
  allowEmotionDetection: boolean
  allowVoiceRecording: boolean
  dataRetentionDays: number
}

export interface SessionSettings {
  maxDuration: number // minutes
  autoSave: boolean
  parentalOverride: boolean
}

// Storytelling types
export interface StorySession {
  id: string
  userId: string
  childName: string
  startTime: Date
  endTime?: Date
  currentScene: StoryScene
  characters: Character[]
  emotionalState: EmotionalState
  transcript: TranscriptEntry[]
  metadata: SessionMetadata
  tauvusConversationId?: string
  storyTemplate: StoryTemplate
  currentMilestone: string
  safetyAlerts: SafetyAlert[]
}

export interface StoryTemplate {
  id: string
  title: string
  category: 'adventure' | 'educational' | 'moral' | 'bedtime'
  ageRange: [number, number]
  description: string
  estimatedDuration: number
  difficulty: 'simple' | 'intermediate' | 'advanced'
  replicaId: string // Tauvus replica to use for this story
  storyType: 'static' | 'dynamic'
}

export interface SafetyAlert {
  level: 'low' | 'medium' | 'high'
  keywords: string[]
  message: string
  timestamp: Date
  context: 'child-input' | 'story-content' | 'behavior-analysis'
  resolved?: boolean
}

export interface StoryScene {
  id: string
  title: string
  description: string
  setting: string
  characters: string[]
  mood: 'happy' | 'exciting' | 'calm' | 'mysterious' | 'educational'
  backgroundMusic?: string
  visualElements: VisualElement[]
}

export interface Character {
  id: string
  name: string
  personality: string
  appearance: CharacterAppearance
  voice: VoiceSettings
  role: 'protagonist' | 'companion' | 'narrator' | 'antagonist'
  emotionalRange: EmotionalRange
}

export interface CharacterAppearance {
  model: string // 3D model reference
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  accessories: string[]
  expressions: Expression[]
}

export interface Expression {
  name: string
  blendShapes: Record<string, number>
  duration: number
}

export interface EmotionalRange {
  happiness: number
  excitement: number
  curiosity: number
  empathy: number
  playfulness: number
}

// Emotion detection types
export interface EmotionalState {
  timestamp: Date
  emotions: {
    joy: number
    surprise: number
    anger: number
    fear: number
    sadness: number
    disgust: number
    neutral: number
  }
  attention: number // 0-1 scale
  engagement: number // 0-1 scale
  confidence: number // confidence in detection
}

export interface FaceDetection {
  landmarks: number[][]
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
  confidence: number
}

// Audio/Voice types
export interface VoiceInput {
  text: string
  confidence: number
  timestamp: Date
  duration: number
}

export interface AudioOutput {
  text: string
  audioUrl: string
  character: string
  emotion: string
  duration: number
}

// WebRTC and streaming types
export interface StreamConfig {
  video: boolean
  audio: boolean
  quality: 'low' | 'medium' | 'high'
  frameRate: number
}

export interface WebRTCConnection {
  id: string
  status: 'connecting' | 'connected' | 'disconnected' | 'failed'
  stream?: MediaStream
  peerConnection?: RTCPeerConnection
}

// UI and interaction types
export interface VisualElement {
  type: 'background' | 'prop' | 'effect'
  id: string
  position: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  animation?: Animation
}

export interface Animation {
  type: 'loop' | 'once' | 'pingpong'
  duration: number
  easing: string
  keyframes: Keyframe[]
}

export interface Keyframe {
  time: number // 0-1
  values: Record<string, number>
}

// Session and data types
export interface TranscriptEntry {
  timestamp: Date
  speaker: 'child' | 'character' | 'system'
  text: string
  emotion?: string
  confidence?: number
}

export interface SessionMetadata {
  version: string
  deviceInfo: DeviceInfo
  performanceMetrics: PerformanceMetrics
  errors: ErrorLog[]
}

export interface DeviceInfo {
  userAgent: string
  screenSize: { width: number; height: number }
  deviceType: 'mobile' | 'tablet' | 'desktop'
  hasCamera: boolean
  hasMicrophone: boolean
  webglSupport: boolean
}

export interface PerformanceMetrics {
  averageFPS: number
  memoryUsage: number
  networkLatency: number
  audioLatency: number
  emotionDetectionLatency: number
}

export interface ErrorLog {
  timestamp: Date
  level: 'info' | 'warn' | 'error' | 'critical'
  message: string
  stack?: string
  context?: Record<string, any>
}

// API and backend types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
}

export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: Date
  sessionId: string
}

// Configuration types
export interface AppConfig {
  auth0: {
    domain: string
    clientId: string
  }
  api: {
    baseUrl: string
    timeout: number
  }
  features: {
    emotionDetection: boolean
    voiceInput: boolean
    webrtc: boolean
    analytics: boolean
  }
  limits: {
    maxSessionDuration: number
    maxConcurrentSessions: number
    maxFileSize: number
  }
}