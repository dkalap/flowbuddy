import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Exercise from './pages/Exercise'
import Care from './pages/Care'
import Awareness from './pages/Awareness'
import Profile from './pages/Profile'
import Games from './pages/Games'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/exercise" element={<ProtectedRoute><Exercise /></ProtectedRoute>} />
      <Route path="/care" element={<ProtectedRoute><Care /></ProtectedRoute>} />
      <Route path="/awareness" element={<ProtectedRoute><Awareness /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
    </Routes>
  )
}

export default App