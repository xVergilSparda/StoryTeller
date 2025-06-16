import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Box } from '@react-three/drei'
import * as THREE from 'three'
import type { Character, EmotionalState } from '../types'

interface Avatar3DProps {
  character: Character
  emotionalState: EmotionalState | null
  isSpeaking: boolean
}

const Avatar3D: React.FC<Avatar3DProps> = ({ character, emotionalState, isSpeaking }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const eyesRef = useRef<THREE.Group>(null)
  
  // Animation based on emotional state and speaking
  useFrame((state) => {
    if (!meshRef.current) return
    
    // Gentle floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    
    // Rotation based on emotion
    if (emotionalState) {
      const joyLevel = emotionalState.emotions.joy
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * joyLevel * 0.1
    }
    
    // Speaking animation
    if (isSpeaking && eyesRef.current) {
      eyesRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.1)
    }
  })

  // Simple fox-like character representation
  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Body */}
      <Sphere args={[1, 32, 32]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color={character.appearance.colors.primary} />
      </Sphere>
      
      {/* Head */}
      <Sphere args={[0.8, 32, 32]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color={character.appearance.colors.primary} />
      </Sphere>
      
      {/* Ears */}
      <group>
        <Box args={[0.3, 0.6, 0.1]} position={[-0.4, 1.3, 0]} rotation={[0, 0, -0.3]}>
          <meshStandardMaterial color={character.appearance.colors.primary} />
        </Box>
        <Box args={[0.3, 0.6, 0.1]} position={[0.4, 1.3, 0]} rotation={[0, 0, 0.3]}>
          <meshStandardMaterial color={character.appearance.colors.primary} />
        </Box>
      </group>
      
      {/* Eyes */}
      <group ref={eyesRef}>
        <Sphere args={[0.1, 16, 16]} position={[-0.2, 0.9, 0.6]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>
        <Sphere args={[0.1, 16, 16]} position={[0.2, 0.9, 0.6]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>
      </group>
      
      {/* Nose */}
      <Sphere args={[0.05, 16, 16]} position={[0, 0.7, 0.7]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      
      {/* Tail */}
      <Sphere args={[0.4, 16, 16]} position={[0, -0.8, -0.8]}>
        <meshStandardMaterial color={character.appearance.colors.secondary} />
      </Sphere>
    </group>
  )
}

export default Avatar3D