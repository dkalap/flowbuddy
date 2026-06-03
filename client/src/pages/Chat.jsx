import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../api/index'

const suggestions = [
  "What is a normal cycle length?",
  "Why do I get cramps?",
  "What is PMS?",
  "When am I most fertile?",
  "Is it normal to miss a period?",
  "What foods help during periods?",
  "How can I support someone on their period?",
  "What is ovulation?",
]

export default function Chat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `Hi ${user?.name?.split(' ')[0]}! 🌸 I'm your FlowBuddy AI. Ask me anything about periods, hormones, or women's health. No question is too shy — this is a safe space! 💕`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')

    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)

    try {
      const res = await api.post('/chat', { message: msg })
      setMessages(prev => [...prev, { role: 'bot', text: res.data.answer }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Please try again! 🌸' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#FDF6F9', display: 'flex', flexDirection: 'column' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <Navbar />

      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', color: '#2D1B2E', fontWeight: 400, marginBottom: '0.5rem' }}>
            Ask <span style={{ fontStyle: 'italic', color: '#D4537E' }}>anything</span> 💬
          </h1>
          <p style={{ color: '#7A5C6E', fontSize: '14px', fontWeight: 300 }}>
            No judgment, no shame — just honest answers about periods & health
          </p>
        </div>

        {/* CHAT BOX */}
        <div style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '24px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '500px' }}>

          {/* MESSAGES */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'bot' && (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #F4C0D1, #C9B8E8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginRight: '8px', flexShrink: 0, alignSelf: 'flex-end' }}>
                    🌸
                  </div>
                )}
                <div style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #D4537E, #993556)' : '#F8F0F4',
                  color: msg.role === 'user' ? 'white' : '#2D1B2E',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #F4C0D1, #C9B8E8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🌸</div>
                <div style={{ background: '#F8F0F4', padding: '12px 16px', borderRadius: '20px 20px 20px 4px', fontSize: '14px', color: '#7A5C6E', fontStyle: 'italic' }}>
                  Thinking... 💭
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* SUGGESTIONS */}
          <div style={{ padding: '0 1.5rem 1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {suggestions.slice(0, 4).map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)}
                style={{ border: '1px solid rgba(212,83,126,0.2)', background: '#FDF6F9', color: '#993556', padding: '6px 14px', borderRadius: '50px', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,83,126,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FDF6F9' }}>
                {s}
              </button>
            ))}
          </div>

          {/* INPUT */}
          <div style={{ padding: '1rem 1.5rem', borderTop: '0.5px solid rgba(212,83,126,0.1)', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything..."
              style={{ flex: 1, border: '1.5px solid rgba(212,83,126,0.2)', borderRadius: '50px', padding: '12px 20px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", outline: 'none', background: '#FDF6F9', color: '#2D1B2E' }}
              onFocus={e => e.target.style.borderColor = '#D4537E'}
              onBlur={e => e.target.style.borderColor = 'rgba(212,83,126,0.2)'}
            />
            <button onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', background: loading ? '#C9B8E8' : 'linear-gradient(135deg, #D4537E, #993556)', color: 'white', fontSize: '18px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              ➤
            </button>
          </div>
        </div>

        {/* MORE SUGGESTIONS */}
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '12px', color: '#7A5C6E', marginBottom: '8px', fontWeight: 300 }}>More questions to explore:</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {suggestions.slice(4).map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)}
                style={{ border: '1px solid rgba(123,104,204,0.2)', background: '#EEEDFE', color: '#534AB7', padding: '6px 14px', borderRadius: '50px', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}