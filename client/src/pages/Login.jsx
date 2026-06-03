import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/index'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    if (!form.email || !form.password) return setError('Please fill all fields!')
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#FDF6F9', display: 'flex' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* LEFT PANEL */}
      <div style={{ flex: 1, background: 'linear-gradient(160deg, #C9B8E8 0%, #F4C0D1 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 300, height: 300, background: 'rgba(255,255,255,0.15)', borderRadius: '60% 40% 55% 45%', top: '-10%', left: '-10%' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '40% 60% 45% 55%', bottom: '10%', right: '-5%' }} />

        <div style={{ position: 'relative', textAlign: 'center', color: 'white' }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.5rem', marginBottom: '1rem' }}>
            Flow<span style={{ fontStyle: 'italic' }}>Buddy</span> 🌸
          </div>
          <p style={{ fontSize: '1.1rem', fontWeight: 300, lineHeight: 1.7, opacity: 0.9, maxWidth: 280 }}>
            Welcome back! Your cycle companion missed you 💕
          </p>
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['🌸 Your data is safe & private', '💬 AI chat history saved', '🗓️ Your cycle logs waiting', '💪 Keep the streak going!'].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50px', padding: '10px 20px', fontSize: '14px', backdropFilter: 'blur(10px)' }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: '#2D1B2E', marginBottom: '0.5rem', fontWeight: 400 }}>
              Welcome back 🌸
            </h1>
            <p style={{ color: '#7A5C6E', fontSize: '15px', fontWeight: 300 }}>
              New here? <Link to="/signup" style={{ color: '#D4537E', textDecoration: 'none', fontWeight: 500 }}>Create an account</Link>
            </p>
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '12px', padding: '12px 16px', color: '#991B1B', fontSize: '14px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#2D1B2E', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
              <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handle}
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid rgba(212,83,126,0.2)', borderRadius: '12px', fontSize: '15px', fontFamily: "'DM Sans', sans-serif", outline: 'none', background: 'white', color: '#2D1B2E', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#D4537E'}
                onBlur={e => e.target.style.borderColor = 'rgba(212,83,126,0.2)'}
                onKeyDown={e => e.key === 'Enter' && submit()} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#2D1B2E', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Your password" value={form.password} onChange={handle}
                  style={{ width: '100%', padding: '12px 48px 12px 16px', border: '1.5px solid rgba(212,83,126,0.2)', borderRadius: '12px', fontSize: '15px', fontFamily: "'DM Sans', sans-serif", outline: 'none', background: 'white', color: '#2D1B2E', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#D4537E'}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,83,126,0.2)'}
                  onKeyDown={e => e.key === 'Enter' && submit()} />
                <button onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#7A5C6E', padding: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button onClick={submit} disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? '#C9B8E8' : 'linear-gradient(135deg, #7B68CC, #534AB7)', color: 'white', border: 'none', borderRadius: '50px', fontSize: '16px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 8px 32px rgba(83,74,183,0.25)' }}>
              {loading ? 'Logging in... 🌸' : 'Login to FlowBuddy 🌸'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#7A5C6E', fontWeight: 300, lineHeight: 1.6 }}>
              FlowBuddy is not a medical app. Always consult a doctor for medical concerns 💕
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}