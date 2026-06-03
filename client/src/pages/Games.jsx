import { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from '../components/Navbar'

// ============================================================
// GAME 1 — BUBBLE CHALLENGE
// ============================================================
const COLORS = [
  { name: 'Pink',   color: '#F4A7B9', light: '#FBEAF0' },
  { name: 'Purple', color: '#AFA9EC', light: '#EEEDFE' },
  { name: 'Mint',   color: '#5DCAA5', light: '#E1F5EE' },
  { name: 'Peach',  color: '#F0997B', light: '#FAECE7' },
  { name: 'Blue',   color: '#85B7EB', light: '#E6F1FB' },
  { name: 'Yellow', color: '#EF9F27', light: '#FAEEDA' },
]

const BUBBLE_LEVELS = {
  easy:   { label: 'Easy',   time: 30, speed: 3,  bubbleCount: 8,  colors: 3, points: 10 },
  medium: { label: 'Medium', time: 25, speed: 5,  bubbleCount: 12, colors: 4, points: 20 },
  hard:   { label: 'Hard',   time: 20, speed: 7,  bubbleCount: 16, colors: 6, points: 30 },
}

function generateBubble(id, levelKey) {
  const level = BUBBLE_LEVELS[levelKey]
  const colorPool = COLORS.slice(0, level.colors)
  const color = colorPool[Math.floor(Math.random() * colorPool.length)]
  const size = Math.random() * 25 + 40
  return {
    id, color, size,
    x: Math.random() * 80 + 5,
    y: Math.random() * 80 + 5,
    vx: (Math.random() - 0.5) * level.speed,
    vy: (Math.random() - 0.5) * level.speed,
    popping: false,
  }
}

function BubbleGame() {
  const [screen, setScreen] = useState('menu')
  const [level, setLevel] = useState('easy')
  const [bubbles, setBubbles] = useState([])
  const [target, setTarget] = useState(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(30)
  const [streak, setStreak] = useState(0)
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('fb_bubble_hs') || '0'))
  const [feedback, setFeedback] = useState(null)
  const [nextTarget, setNextTarget] = useState(null)
  const animRef = useRef(null)
  const timerRef = useRef(null)
  const bubblesRef = useRef([])
  const gameActiveRef = useRef(false)
  const scoreRef = useRef(0)
  const livesRef = useRef(3)
  const streakRef = useRef(0)

  const pickNewTarget = useCallback((currentTarget, levelKey) => {
    const pool = COLORS.slice(0, BUBBLE_LEVELS[levelKey].colors)
    const others = pool.filter(c => c.name !== currentTarget?.name)
    return others[Math.floor(Math.random() * others.length)]
  }, [])

  const startGame = (selectedLevel) => {
    const lvl = BUBBLE_LEVELS[selectedLevel]
    const initialBubbles = Array.from({ length: lvl.bubbleCount }, (_, i) => generateBubble(i, selectedLevel))
    const firstTarget = COLORS[Math.floor(Math.random() * lvl.colors)]
    const second = pickNewTarget(firstTarget, selectedLevel)
    bubblesRef.current = initialBubbles
    gameActiveRef.current = true
    scoreRef.current = 0
    livesRef.current = 3
    streakRef.current = 0
    setBubbles(initialBubbles)
    setTarget(firstTarget)
    setNextTarget(second)
    setScore(0)
    setLives(3)
    setStreak(0)
    setTimeLeft(lvl.time)
    setFeedback(null)
    setScreen('playing')
  }

  useEffect(() => {
    if (screen !== 'playing') return
    const animate = () => {
      bubblesRef.current = bubblesRef.current.map(b => {
        if (b.popping) return b
        let nx = b.x + b.vx * 0.05
        let ny = b.y + b.vy * 0.05
        let nvx = b.vx, nvy = b.vy
        if (nx <= 2 || nx >= 90) nvx = -nvx
        if (ny <= 2 || ny >= 88) nvy = -nvy
        return { ...b, x: nx, y: ny, vx: nvx, vy: nvy }
      })
      setBubbles([...bubblesRef.current])
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [screen])

  useEffect(() => {
    if (screen !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          gameActiveRef.current = false
          setScreen('gameover')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [screen])

  const targetRef = useRef(null)
  const nextTargetRef = useRef(null)

  useEffect(() => { targetRef.current = target }, [target])
  useEffect(() => { nextTargetRef.current = nextTarget }, [nextTarget])

  const handleBubbleClick = (bubble) => {
    if (!gameActiveRef.current || bubble.popping) return
    if (bubble.color.name === targetRef.current?.name) {
      streakRef.current += 1
      const bonus = streakRef.current >= 3 ? 2 : 1
      const points = BUBBLE_LEVELS[level].points * bonus
      scoreRef.current += points
      const newScore = scoreRef.current
      setStreak(streakRef.current)
      setScore(newScore)
      setFeedback({ type: 'good', text: streakRef.current >= 3 ? `🔥 ${streakRef.current} streak! +${points}` : `✅ +${points}` })
      setTimeout(() => setFeedback(null), 600)
      bubblesRef.current = bubblesRef.current.map(b => b.id === bubble.id ? { ...b, popping: true } : b)
      setTimeout(() => {
        bubblesRef.current = bubblesRef.current.map(b => b.id === bubble.id ? generateBubble(b.id, level) : b)
      }, 300)
      const nt = nextTargetRef.current
      setTarget(nt)
      targetRef.current = nt
      const newNext = pickNewTarget(nt, level)
      setNextTarget(newNext)
      nextTargetRef.current = newNext
      if (newScore > highScore) {
        setHighScore(newScore)
        localStorage.setItem('fb_bubble_hs', newScore.toString())
      }
    } else {
      livesRef.current -= 1
      streakRef.current = 0
      setLives(livesRef.current)
      setStreak(0)
      setFeedback({ type: 'bad', text: `❌ Wrong! -1 life` })
      setTimeout(() => setFeedback(null), 600)
      if (livesRef.current <= 0) {
        gameActiveRef.current = false
        clearInterval(timerRef.current)
        cancelAnimationFrame(animRef.current)
        setTimeout(() => setScreen('gameover'), 300)
      }
    }
  }

  const timerPercent = (timeLeft / BUBBLE_LEVELS[level].time) * 100
  const timerColor = timerPercent > 50 ? '#5DCAA5' : timerPercent > 25 ? '#EF9F27' : '#D4537E'

  return (
    <div>
      {screen === 'menu' && (
        <div style={{ textAlign: 'center' }}>
          {highScore > 0 && (
            <div style={{ display: 'inline-block', background: 'rgba(212,83,126,0.08)', border: '1px solid rgba(212,83,126,0.2)', borderRadius: '50px', padding: '6px 20px', marginBottom: '1.5rem', fontSize: '14px', color: '#993556', fontWeight: 500 }}>
              🏆 Best: {highScore}
            </div>
          )}
          <div style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '20px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1rem', color: '#2D1B2E', marginBottom: '0.75rem', fontWeight: 400 }}>How to play 🎮</h3>
            {[
              { icon: '🎯', text: 'A TARGET COLOR is shown — pop ONLY that color' },
              { icon: '❌', text: 'Wrong color = lose a life (3 lives total)' },
              { icon: '🔥', text: '3+ streak = 2x points multiplier!' },
              { icon: '⏱️', text: 'Beat the clock before time runs out!' },
            ].map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                <span>{h.icon}</span>
                <span style={{ fontSize: '13px', color: '#7A5C6E', fontWeight: 300 }}>{h.text}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '1.5rem' }}>
            {Object.entries(BUBBLE_LEVELS).map(([key, lvl]) => (
              <button key={key} onClick={() => setLevel(key)}
                style={{ border: `2px solid ${level === key ? '#D4537E' : 'rgba(212,83,126,0.2)'}`, background: level === key ? 'rgba(212,83,126,0.08)' : 'white', borderRadius: '14px', padding: '0.75rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ fontSize: '1.3rem' }}>{key === 'easy' ? '🌸' : key === 'medium' ? '💪' : '🔥'}</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: level === key ? '#993556' : '#2D1B2E' }}>{lvl.label}</div>
                <div style={{ fontSize: '11px', color: '#7A5C6E', fontWeight: 300 }}>{lvl.time}s • {lvl.points}pts</div>
              </button>
            ))}
          </div>
          <button onClick={() => startGame(level)}
            style={{ background: 'linear-gradient(135deg, #D4537E, #993556)', color: 'white', border: 'none', padding: '14px 40px', borderRadius: '50px', fontSize: '16px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 8px 32px rgba(153,53,86,0.25)' }}>
            Start Game 🔵
          </button>
        </div>
      )}

      {screen === 'playing' && target && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '0.75rem' }}>
            {[
              { label: 'Score', value: score, color: '#D4537E' },
              { label: 'Lives', value: '❤️'.repeat(lives) + '🖤'.repeat(3 - lives), color: '#2D1B2E' },
              { label: 'Streak', value: streak >= 3 ? `🔥${streak}` : streak, color: streak >= 3 ? '#EF9F27' : '#2D1B2E' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '12px', padding: '0.6rem', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#7A5C6E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#F0EAF0', borderRadius: '50px', height: '6px', marginBottom: '0.75rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${timerPercent}%`, background: timerColor, borderRadius: '50px', transition: 'width 1s linear' }} />
          </div>

          <div style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '16px', padding: '0.75rem 1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: '#7A5C6E', fontWeight: 300 }}>Pop:</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: target.color, border: '3px solid white', boxShadow: `0 4px 12px ${target.color}80` }} />
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#2D1B2E' }}>{target.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#7A5C6E' }}>Next:</span>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: nextTarget?.color, opacity: 0.6 }} />
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '380px', background: 'linear-gradient(135deg, #FDF6F9, #F0EBF8)', borderRadius: '20px', overflow: 'hidden', border: '0.5px solid rgba(212,83,126,0.2)', cursor: 'crosshair' }}>
            {feedback && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 10, fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: feedback.type === 'good' ? '#0F6E56' : '#993556', background: 'rgba(255,255,255,0.92)', padding: '8px 20px', borderRadius: '50px', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                {feedback.text}
              </div>
            )}
            <div style={{ position: 'absolute', top: '10px', right: '14px', fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: timerColor, zIndex: 5 }}>{timeLeft}s</div>
            {bubbles.map(bubble => (
              <div key={bubble.id} onClick={() => handleBubbleClick(bubble)}
                style={{ position: 'absolute', left: `${bubble.x}%`, top: `${bubble.y}%`, width: bubble.size, height: bubble.size, borderRadius: '50%', background: bubble.color.color, border: `3px solid ${bubble.color.light}`, cursor: 'pointer', boxShadow: `0 4px 15px ${bubble.color.color}60, inset 0 3px 6px rgba(255,255,255,0.4)`, transform: bubble.popping ? 'scale(0)' : 'scale(1)', opacity: bubble.popping ? 0 : 1, transition: bubble.popping ? 'transform 0.3s, opacity 0.3s' : 'none', userSelect: 'none' }}>
                <div style={{ width: '30%', height: '30%', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', position: 'absolute', top: '15%', left: '20%' }} />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
            <button onClick={() => { cancelAnimationFrame(animRef.current); clearInterval(timerRef.current); setScreen('menu') }}
              style={{ border: '1.5px solid rgba(212,83,126,0.3)', background: 'transparent', color: '#7A5C6E', padding: '6px 18px', borderRadius: '50px', cursor: 'pointer', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>
              Quit
            </button>
          </div>
        </div>
      )}

      {screen === 'gameover' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '24px', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{score >= highScore && score > 0 ? '🏆' : '😅'}</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', color: '#2D1B2E', fontWeight: 400, marginBottom: '1.5rem' }}>
              {score >= highScore && score > 0 ? 'New High Score!' : 'Game Over!'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ background: '#FBEAF0', borderRadius: '16px', padding: '1rem' }}>
                <div style={{ fontSize: '11px', color: '#993556', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Score</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.5rem', color: '#D4537E' }}>{score}</div>
              </div>
              <div style={{ background: '#EEEDFE', borderRadius: '16px', padding: '1rem' }}>
                <div style={{ fontSize: '11px', color: '#534AB7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🏆 Best</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.5rem', color: '#7B68CC' }}>{highScore}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => startGame(level)}
                style={{ background: 'linear-gradient(135deg, #D4537E, #993556)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Play Again 🔵
              </button>
              <button onClick={() => setScreen('menu')}
                style={{ border: '1.5px solid rgba(212,83,126,0.3)', background: 'white', color: '#993556', padding: '12px 28px', borderRadius: '50px', fontSize: '15px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// GAME 2 — CATCH THE GOOD STUFF
// ============================================================
const GOOD_ITEMS = [
  { emoji: '🍫', label: 'Dark Chocolate', points: 15 },
  { emoji: '🍌', label: 'Banana', points: 10 },
  { emoji: '🍇', label: 'Blueberries', points: 12 },
  { emoji: '🥬', label: 'Greens', points: 10 },
  { emoji: '🌰', label: 'Nuts', points: 8 },
  { emoji: '🥑', label: 'Avocado', points: 20 },
  { emoji: '💊', label: 'Vitamins', points: 15 },
  { emoji: '🍵', label: 'Ginger Tea', points: 12 },
  { emoji: '🥚', label: 'Eggs', points: 10 },
  { emoji: '🌸', label: 'Self Love', points: 25 },
]

const BAD_ITEMS = [
  { emoji: '☕', label: 'Too Much Coffee', points: -10 },
  { emoji: '🍔', label: 'Junk Food', points: -15 },
  { emoji: '🧂', label: 'Salty Chips', points: -10 },
  { emoji: '🍭', label: 'Sugar Rush', points: -12 },
  { emoji: '🍺', label: 'Alcohol', points: -20 },
  { emoji: '🌶️', label: 'Spicy Food', points: -10 },
]

const CATCH_LEVELS = {
  easy:   { label: 'Easy',   time: 45, speed: 1.5, spawnRate: 1500, badChance: 0.25 },
  medium: { label: 'Medium', time: 40, speed: 2.5, spawnRate: 1200, badChance: 0.35 },
  hard:   { label: 'Hard',   time: 35, speed: 3.5, spawnRate: 900,  badChance: 0.45 },
}

function CatchGame() {
  const [screen, setScreen] = useState('menu')
  const [level, setLevel] = useState('easy')
  const [items, setItems] = useState([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(45)
  const [basketX, setBasketX] = useState(50)
  const [feedback, setFeedback] = useState(null)
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('fb_catch_hs') || '0'))
  const gameAreaRef = useRef(null)
  const animRef = useRef(null)
  const spawnRef = useRef(null)
  const timerRef = useRef(null)
  const itemsRef = useRef([])
  const scoreRef = useRef(0)
  const livesRef = useRef(3)
  const basketRef = useRef(50)
  const gameActiveRef = useRef(false)
  const idRef = useRef(0)

  const startGame = (selectedLevel) => {
    const lvl = CATCH_LEVELS[selectedLevel]
    itemsRef.current = []
    scoreRef.current = 0
    livesRef.current = 3
    basketRef.current = 50
    gameActiveRef.current = true
    idRef.current = 0
    setItems([])
    setScore(0)
    setLives(3)
    setTimeLeft(lvl.time)
    setBasketX(50)
    setFeedback(null)
    setScreen('playing')
  }

  // Mouse/touch move for basket
  useEffect(() => {
    if (screen !== 'playing') return
    const handleMove = (e) => {
      const area = gameAreaRef.current
      if (!area) return
      const rect = area.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100))
      basketRef.current = pct
      setBasketX(pct)
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
    }
  }, [screen])

  // Spawn items
  useEffect(() => {
    if (screen !== 'playing') return
    const lvl = CATCH_LEVELS[level]
    spawnRef.current = setInterval(() => {
      if (!gameActiveRef.current) return
      const isBad = Math.random() < lvl.badChance
      const pool = isBad ? BAD_ITEMS : GOOD_ITEMS
      const item = pool[Math.floor(Math.random() * pool.length)]
      const newItem = {
        id: idRef.current++,
        emoji: item.emoji,
        label: item.label,
        points: item.points,
        isBad,
        x: Math.random() * 85 + 5,
        y: -8,
        speed: lvl.speed + Math.random() * 1.5,
      }
      itemsRef.current = [...itemsRef.current, newItem]
    }, lvl.spawnRate)
    return () => clearInterval(spawnRef.current)
  }, [screen, level])

  // Animation — fall items + collision
  useEffect(() => {
    if (screen !== 'playing') return
    const animate = () => {
      itemsRef.current = itemsRef.current.map(item => ({
        ...item, y: item.y + item.speed * 0.15
      }))

      // Check collisions
      const basketLeft = basketRef.current - 8
      const basketRight = basketRef.current + 8
      const basketTop = 82

      const remaining = []
      let scoreDelta = 0
      let liveDelta = 0
      let lastFeedback = null

      itemsRef.current.forEach(item => {
        if (item.y >= basketTop && item.y <= basketTop + 8) {
          if (item.x >= basketLeft && item.x <= basketRight) {
            scoreDelta += item.points
            if (item.isBad) liveDelta -= 1
            lastFeedback = {
              type: item.isBad ? 'bad' : 'good',
              text: item.isBad ? `${item.emoji} ${item.points}pts 😣` : `${item.emoji} +${item.points}pts 🎉`
            }
          } else if (item.y > 95) {
            // missed good item
            if (!item.isBad) {
              liveDelta -= 1
              lastFeedback = { type: 'miss', text: `Missed ${item.emoji}! -1 life` }
            }
          } else {
            remaining.push(item)
          }
        } else if (item.y > 100) {
          if (!item.isBad) {
            liveDelta -= 1
            lastFeedback = { type: 'miss', text: `Missed ${item.emoji}! -1 life` }
          }
        } else {
          remaining.push(item)
        }
      })

      itemsRef.current = remaining

      if (scoreDelta !== 0) {
        scoreRef.current = Math.max(0, scoreRef.current + scoreDelta)
        setScore(scoreRef.current)
        if (scoreRef.current > parseInt(localStorage.getItem('fb_catch_hs') || '0')) {
          localStorage.setItem('fb_catch_hs', scoreRef.current.toString())
          setHighScore(scoreRef.current)
        }
      }

      if (liveDelta < 0) {
        livesRef.current = Math.max(0, livesRef.current + liveDelta)
        setLives(livesRef.current)
        if (livesRef.current <= 0) {
          gameActiveRef.current = false
          clearInterval(spawnRef.current)
          clearInterval(timerRef.current)
          cancelAnimationFrame(animRef.current)
          setScreen('gameover')
          return
        }
      }

      if (lastFeedback) {
        setFeedback(lastFeedback)
        setTimeout(() => setFeedback(null), 700)
      }

      setItems([...itemsRef.current])
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [screen])

  // Timer
  useEffect(() => {
    if (screen !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          clearInterval(spawnRef.current)
          gameActiveRef.current = false
          setScreen('gameover')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [screen])

  const timerPercent = (timeLeft / CATCH_LEVELS[level].time) * 100
  const timerColor = timerPercent > 50 ? '#5DCAA5' : timerPercent > 25 ? '#EF9F27' : '#D4537E'

  return (
    <div>
      {screen === 'menu' && (
        <div style={{ textAlign: 'center' }}>
          {highScore > 0 && (
            <div style={{ display: 'inline-block', background: 'rgba(212,83,126,0.08)', border: '1px solid rgba(212,83,126,0.2)', borderRadius: '50px', padding: '6px 20px', marginBottom: '1.5rem', fontSize: '14px', color: '#993556', fontWeight: 500 }}>
              🏆 Best: {highScore}
            </div>
          )}

          <div style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '20px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1rem', color: '#2D1B2E', marginBottom: '0.75rem', fontWeight: 400 }}>How to play 🎮</h3>
            {[
              { icon: '🏃', text: 'Move your mouse to control the basket' },
              { icon: '🍫', text: 'Catch good foods falling from the top' },
              { icon: '☕', text: 'Avoid bad foods — they cost a life!' },
              { icon: '💔', text: 'Missing good food also costs a life!' },
              { icon: '⏱️', text: 'Score as much as possible before time runs out!' },
            ].map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                <span>{h.icon}</span>
                <span style={{ fontSize: '13px', color: '#7A5C6E', fontWeight: 300 }}>{h.text}</span>
              </div>
            ))}
          </div>

          {/* Good vs Bad preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
            <div style={{ background: '#E1F5EE', borderRadius: '14px', padding: '1rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F6E56', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>✅ Catch these</div>
              <div style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>🍫🍌🍇🥬🌰🥑</div>
            </div>
            <div style={{ background: '#FAECE7', borderRadius: '14px', padding: '1rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#993C1D', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>❌ Avoid these</div>
              <div style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>☕🍔🧂🍭🍺🌶️</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '1.5rem' }}>
            {Object.entries(CATCH_LEVELS).map(([key, lvl]) => (
              <button key={key} onClick={() => setLevel(key)}
                style={{ border: `2px solid ${level === key ? '#D4537E' : 'rgba(212,83,126,0.2)'}`, background: level === key ? 'rgba(212,83,126,0.08)' : 'white', borderRadius: '14px', padding: '0.75rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ fontSize: '1.3rem' }}>{key === 'easy' ? '🌸' : key === 'medium' ? '💪' : '🔥'}</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: level === key ? '#993556' : '#2D1B2E' }}>{lvl.label}</div>
                <div style={{ fontSize: '11px', color: '#7A5C6E', fontWeight: 300 }}>{lvl.time}s</div>
              </button>
            ))}
          </div>

          <button onClick={() => startGame(level)}
            style={{ background: 'linear-gradient(135deg, #5DCAA5, #0F6E56)', color: 'white', border: 'none', padding: '14px 40px', borderRadius: '50px', fontSize: '16px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 8px 32px rgba(15,110,86,0.25)' }}>
            Start Catching! 🍫
          </button>
        </div>
      )}

      {screen === 'playing' && (
        <div>
          {/* HUD */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '0.75rem' }}>
            {[
              { label: 'Score', value: score, color: '#D4537E' },
              { label: 'Lives', value: '❤️'.repeat(lives) + '🖤'.repeat(3 - lives) },
              { label: 'Time', value: `${timeLeft}s`, color: timerColor },
            ].map((s, i) => (
              <div key={i} style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '12px', padding: '0.6rem', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#7A5C6E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: s.color || '#2D1B2E' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Timer bar */}
          <div style={{ background: '#F0EAF0', borderRadius: '50px', height: '6px', marginBottom: '0.75rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${timerPercent}%`, background: timerColor, borderRadius: '50px', transition: 'width 1s linear' }} />
          </div>

          {/* Game area */}
          <div ref={gameAreaRef} style={{ position: 'relative', width: '100%', height: '420px', background: 'linear-gradient(180deg, #E1F5EE 0%, #FDF6F9 100%)', borderRadius: '20px', overflow: 'hidden', border: '0.5px solid rgba(212,83,126,0.2)', cursor: 'none', userSelect: 'none' }}>

            {feedback && (
              <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 10, fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: feedback.type === 'good' ? '#0F6E56' : '#993556', background: 'rgba(255,255,255,0.92)', padding: '6px 18px', borderRadius: '50px', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                {feedback.text}
              </div>
            )}

            {/* Falling items */}
            {items.map(item => (
              <div key={item.id} style={{ position: 'absolute', left: `${item.x}%`, top: `${item.y}%`, fontSize: '1.8rem', transform: 'translate(-50%, -50%)', pointerEvents: 'none', userSelect: 'none', filter: item.isBad ? 'drop-shadow(0 0 6px rgba(200,50,50,0.4))' : 'drop-shadow(0 0 6px rgba(50,200,100,0.3))' }}>
                {item.emoji}
              </div>
            ))}

            {/* Basket */}
            <div style={{ position: 'absolute', bottom: '8%', left: `${basketX}%`, transform: 'translateX(-50%)', width: '80px', textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: '2.5rem' }}>🧺</div>
            </div>

            {/* Ground line */}
            <div style={{ position: 'absolute', bottom: '6%', left: '5%', right: '5%', height: '1px', background: 'rgba(212,83,126,0.15)' }} />
          </div>

          <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
            <button onClick={() => { cancelAnimationFrame(animRef.current); clearInterval(spawnRef.current); clearInterval(timerRef.current); setScreen('menu') }}
              style={{ border: '1.5px solid rgba(212,83,126,0.3)', background: 'transparent', color: '#7A5C6E', padding: '6px 18px', borderRadius: '50px', cursor: 'pointer', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>
              Quit
            </button>
          </div>
        </div>
      )}

      {screen === 'gameover' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '24px', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{score >= highScore && score > 0 ? '🏆' : score > 100 ? '🎉' : '😅'}</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', color: '#2D1B2E', fontWeight: 400, marginBottom: '1.5rem' }}>
              {score >= highScore && score > 0 ? 'New High Score!' : 'Game Over!'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ background: '#E1F5EE', borderRadius: '16px', padding: '1rem' }}>
                <div style={{ fontSize: '11px', color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Score</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.5rem', color: '#5DCAA5' }}>{score}</div>
              </div>
              <div style={{ background: '#EEEDFE', borderRadius: '16px', padding: '1rem' }}>
                <div style={{ fontSize: '11px', color: '#534AB7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🏆 Best</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.5rem', color: '#7B68CC' }}>{highScore}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => startGame(level)}
                style={{ background: 'linear-gradient(135deg, #5DCAA5, #0F6E56)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Play Again 🍫
              </button>
              <button onClick={() => setScreen('menu')}
                style={{ border: '1.5px solid rgba(212,83,126,0.3)', background: 'white', color: '#993556', padding: '12px 28px', borderRadius: '50px', fontSize: '15px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// MAIN GAMES PAGE
// ============================================================
export default function Games() {
  const [activeGame, setActiveGame] = useState('bubble')

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#FDF6F9' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <Navbar />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#2D1B2E', fontWeight: 400, marginBottom: '0.5rem' }}>
            Stress <span style={{ fontStyle: 'italic', color: '#D4537E' }}>relief</span> games 🎮
          </h1>
          <p style={{ color: '#7A5C6E', fontSize: '15px', fontWeight: 300 }}>
            Fun mini games to lift your mood during those tough days
          </p>
        </div>

        {/* GAME SELECTOR */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem', justifyContent: 'center' }}>
          {[
            { val: 'bubble', icon: '🔵', label: 'Bubble Challenge', desc: 'Pop the right color!' },
            { val: 'catch', icon: '🍫', label: 'Catch the Good Stuff', desc: 'Catch healthy foods!' },
          ].map(game => (
            <button key={game.val} onClick={() => setActiveGame(game.val)}
              style={{ border: `2px solid ${activeGame === game.val ? '#D4537E' : 'rgba(212,83,126,0.2)'}`, background: activeGame === game.val ? 'rgba(212,83,126,0.08)' : 'white', borderRadius: '16px', padding: '1rem 1.5rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif", minWidth: '160px' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{game.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: activeGame === game.val ? '#993556' : '#2D1B2E' }}>{game.label}</div>
              <div style={{ fontSize: '12px', color: '#7A5C6E', fontWeight: 300 }}>{game.desc}</div>
            </button>
          ))}
        </div>

        {/* GAME AREA */}
        <div style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '24px', padding: '1.5rem' }}>
          {activeGame === 'bubble' ? <BubbleGame /> : <CatchGame />}
        </div>

        <div style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, rgba(212,83,126,0.06), rgba(123,104,204,0.06))', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '16px', padding: '1rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#7A5C6E', fontSize: '13px', fontWeight: 300, margin: 0 }}>
            💡 Games activate your brain's reward center and reduce cortisol (stress hormone). So this is literally therapeutic! 🧠
          </p>
        </div>
      </div>
    </div>
  )
}