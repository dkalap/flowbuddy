import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">
    <div className="text-pink-400 text-xl animate-pulse">Loading FlowBuddy 🌸</div>
  </div>
  return user ? children : <Navigate to="/login" />
}

export default ProtectedRoute