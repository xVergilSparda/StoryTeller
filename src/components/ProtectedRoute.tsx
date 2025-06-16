import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LoadingScreen from './LoadingScreen'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    loginWithRedirect()
    return <LoadingScreen />
  }

  return <>{children}</>
}

export default ProtectedRoute