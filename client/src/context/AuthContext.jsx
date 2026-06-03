import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trackingFor, setTrackingFor] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('flowbuddy_user')
    const storedTracking = localStorage.getItem('flowbuddy_tracking')
    if (stored) setUser(JSON.parse(stored))
    if (storedTracking) setTrackingFor(storedTracking)
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('flowbuddy_token', token)
    localStorage.setItem('flowbuddy_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('flowbuddy_token')
    localStorage.removeItem('flowbuddy_user')
    localStorage.removeItem('flowbuddy_tracking')
    setUser(null)
    setTrackingFor(null)
  }

  const setTracking = (val) => {
    localStorage.setItem('flowbuddy_tracking', val)
    setTrackingFor(val)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, trackingFor, setTracking }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)