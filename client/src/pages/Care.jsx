import { useState } from 'react'
import Navbar from '../components/Navbar'

const foodData = {
  eat: [
    { emoji: '🍇', name: 'Blueberries & fruits', reason: 'Rich in antioxidants, reduces inflammation' },
    { emoji: '🥬', name: 'Dark leafy greens', reason: 'High in iron, replenishes blood loss' },
    { emoji: '🍫', name: 'Dark chocolate', reason: 'Magnesium boost, improves mood instantly' },
    { emoji: '🐟', name: 'Salmon & omega-3s', reason: 'Reduces prostaglandins that cause cramps' },
    { emoji: '🌰', name: 'Nuts & seeds', reason: 'Healthy fats, vitamin E reduces PMS' },
    { emoji: '🍌', name: 'Bananas', reason: 'Magnesium + B6, reduces bloating and mood swings' },
    { emoji: '🧄', name: 'Ginger & turmeric', reason: 'Natural anti-inflammatory, soothes cramps' },
    { emoji: '🥚', name: 'Eggs', reason: 'Protein + vitamin D, keeps energy stable' },
  ],
  avoid: [
    { emoji: '☕', name: 'Too much caffeine', reason: 'Worsens cramps and increases anxiety' },
    { emoji: '🧂', name: 'Salty processed food', reason: 'Increases bloating and water retention' },
    { emoji: '🍭', name: 'Sugary snacks', reason: 'Blood sugar spikes worsen mood swings' },
    { emoji: '🍺', name: 'Alcohol', reason: 'Dehydrates, worsens cramps and fatigue' },
    { emoji: '🧊', name: 'Very cold drinks', reason: 'Can intensify cramping in some people' },
    { emoji: '🍔', name: 'Greasy fast food', reason: 'Increases inflammation and bloating' },
    { emoji: '🥛', name: 'Excess dairy', reason: 'Can trigger bloating and digestive issues' },
    { emoji: '🌶️', name: 'Very spicy food', reason: 'May irritate digestive system during periods' },
  ]
}

const dayGuide = [
  {
    day: 1,
    title: 'Day 1 — The Beginning',
    color: '#FBEAF0',
    textColor: '#993556',
    emoji: '🌸',
    tips: [
      { icon: '🌡️', tip: 'Apply heat pad to lower abdomen for 15-20 mins' },
      { icon: '💧', tip: 'Drink warm water or ginger tea — avoid cold drinks' },
      { icon: '😴', tip: 'Rest as much as possible — your body just started a big process' },
      { icon: '🩸', tip: 'Track your flow — note if it\'s light, medium or heavy' },
    ]
  },
  {
    day: 2,
    title: 'Day 2 — The Toughest',
    color: '#FAECE7',
    textColor: '#993C1D',
    emoji: '💪',
    tips: [
      { icon: '🍫', tip: 'Dark chocolate is your best friend today — have some guilt free!' },
      { icon: '🌡️', tip: 'Heat therapy is most effective today — use it generously' },
      { icon: '🧘', tip: 'Child\'s pose and cat-cow stretches for cramp relief' },
      { icon: '📵', tip: 'Reduce screen time if you have a headache — rest your eyes' },
    ]
  },
  {
    day: 3,
    title: 'Day 3 — Getting Better',
    color: '#EEEDFE',
    textColor: '#534AB7',
    emoji: '✨',
    tips: [
      { icon: '🚶', tip: 'Light walking is great today — endorphins will help!' },
      { icon: '🥗', tip: 'Focus on iron-rich foods to replenish what you\'ve lost' },
      { icon: '💬', tip: 'Talk to someone you trust if you\'re feeling emotional' },
      { icon: '🛁', tip: 'A warm bath today will feel amazing and relaxing' },
    ]
  },
  {
    day: 4,
    title: 'Day 4 — Almost There',
    color: '#E1F5EE',
    textColor: '#0F6E56',
    emoji: '🌿',
    tips: [
      { icon: '🏃', tip: 'Energy is returning — gentle exercise is welcome!' },
      { icon: '💆', tip: 'Self care day — do something that makes you happy' },
      { icon: '🌊', tip: 'Swimming or yoga are great options today' },
      { icon: '📝', tip: 'Note any patterns in your symptoms for next month' },
    ]
  },
  {
    day: 5,
    title: 'Day 5 — The Final Day',
    color: '#FEF3C7',
    textColor: '#854F0B',
    emoji: '🎉',
    tips: [
      { icon: '🎊', tip: 'You survived! Celebrate yourself today' },
      { icon: '💪', tip: 'Energy is almost back to normal — enjoy it!' },
      { icon: '🥗', tip: 'Continue eating iron-rich foods for 2-3 more days' },
      { icon: '📅', tip: 'Mark your next expected period in FlowBuddy calendar' },
    ]
  },
]

const selfCare = [
  { icon: '🌡️', title: 'Heat therapy', desc: 'A heating pad on your lower abdomen for 15-20 mins relaxes cramping muscles better than most painkillers!' },
  { icon: '💧', title: 'Stay hydrated', desc: 'Drink 8-10 glasses of water daily. Warm water is even better — reduces bloating and keeps energy up.' },
  { icon: '😴', title: 'Sleep 7-9 hours', desc: 'Your body is working overtime. Quality sleep is the most underrated period care tip.' },
  { icon: '🧴', title: 'Gentle skincare', desc: 'Hormones cause breakouts. Use gentle, non-comedogenic products and don\'t stress about it.' },
  { icon: '🎵', title: 'Mood boost', desc: 'Music, comfort shows, talking to friends — your feelings are valid. Do whatever makes you feel good.' },
  { icon: '🩺', title: 'When to see a doctor', desc: 'If pain is unbearable, periods are always irregular, or flow is extremely heavy — please see a doctor. You deserve proper care.' },
]

export default function Care() {
  const [activeDay, setActiveDay] = useState(1)
  const [activeTab, setActiveTab] = useState('food')

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#FDF6F9' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#2D1B2E', fontWeight: 400, marginBottom: '0.5rem' }}>
            Take care of <span style={{ fontStyle: 'italic', color: '#D4537E' }}>yourself</span> 💕
          </h1>
          <p style={{ color: '#7A5C6E', fontSize: '15px', fontWeight: 300 }}>
            Food, self-care, and day-by-day guide for your 5 days
          </p>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '8px', background: '#F0EAF0', borderRadius: '50px', padding: '5px', marginBottom: '2rem' }}>
          {[
            { val: 'food', label: '🥗 Food Guide' },
            { val: 'days', label: '📅 5-Day Guide' },
            { val: 'selfcare', label: '💆 Self Care' },
          ].map(tab => (
            <button key={tab.val} onClick={() => setActiveTab(tab.val)}
              style={{ flex: 1, border: 'none', background: activeTab === tab.val ? 'white' : 'transparent', color: activeTab === tab.val ? '#993556' : '#7A5C6E', padding: '10px', borderRadius: '50px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: activeTab === tab.val ? 500 : 400, boxShadow: activeTab === tab.val ? '0 1px 8px rgba(153,53,86,0.12)' : 'none', transition: 'all 0.2s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* FOOD GUIDE */}
        {activeTab === 'food' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* EAT MORE */}
            <div style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '20px', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#0F6E56', fontWeight: 400, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✅ Eat more of these
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {foodData.eat.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{f.emoji}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#2D1B2E' }}>{f.name}</div>
                      <div style={{ fontSize: '11px', color: '#7A5C6E', fontWeight: 300, lineHeight: 1.4 }}>{f.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AVOID */}
            <div style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '20px', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#993C1D', fontWeight: 400, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ❌ Try to avoid these
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {foodData.avoid.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{f.emoji}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#2D1B2E' }}>{f.name}</div>
                      <div style={{ fontSize: '11px', color: '#7A5C6E', fontWeight: 300, lineHeight: 1.4 }}>{f.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5 DAY GUIDE */}
        {activeTab === 'days' && (
          <div>
            {/* Day selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {dayGuide.map(d => (
                <button key={d.day} onClick={() => setActiveDay(d.day)}
                  style={{ border: `1.5px solid ${activeDay === d.day ? d.textColor : 'rgba(212,83,126,0.2)'}`, background: activeDay === d.day ? d.color : 'white', color: activeDay === d.day ? d.textColor : '#7A5C6E', padding: '8px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", fontWeight: activeDay === d.day ? 500 : 400, transition: 'all 0.2s' }}>
                  {d.emoji} Day {d.day}
                </button>
              ))}
            </div>

            {/* Day content */}
            {dayGuide.filter(d => d.day === activeDay).map(d => (
              <div key={d.day}>
                <div style={{ background: d.color, borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: d.textColor, fontWeight: 400 }}>
                    {d.emoji} {d.title}
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  {d.tips.map((tip, i) => (
                    <div key={i} style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '14px', padding: '1rem', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{tip.icon}</span>
                      <p style={{ fontSize: '13px', color: '#7A5C6E', lineHeight: 1.5, fontWeight: 300, margin: 0 }}>{tip.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SELF CARE */}
        {activeTab === 'selfcare' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {selfCare.map((s, i) => (
              <div key={i} style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '16px', padding: '1.25rem' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{s.icon}</div>
                <h4 style={{ fontSize: '14px', fontWeight: 500, color: '#2D1B2E', marginBottom: '6px' }}>{s.title}</h4>
                <p style={{ fontSize: '12px', color: '#7A5C6E', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}