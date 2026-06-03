import { useState } from 'react'
import Navbar from '../components/Navbar'

const myths = [
  { myth: 'Period blood is dirty or impure', fact: 'Period blood is just the uterine lining — completely natural and not dirty at all. It\'s the same blood that flows through your veins!', emoji: '🩸' },
  { myth: 'You shouldn\'t exercise during periods', fact: 'Light exercise actually HELPS! It releases endorphins that reduce cramps and improve mood. Listen to your body though.', emoji: '🏃' },
  { myth: 'PMS is not real, it\'s just mood swings', fact: 'PMS is a medically recognized condition caused by real hormonal changes. The symptoms are completely valid!', emoji: '🧠' },
  { myth: 'Missing periods is always normal', fact: 'Occasionally missing a period can be normal due to stress. But regularly missing periods needs medical attention.', emoji: '📅' },
  { myth: 'You can\'t get pregnant during your period', fact: 'You CAN get pregnant during your period, especially if you have a short cycle. Sperm can survive 5 days!', emoji: '⚠️' },
  { myth: 'Tampons can get lost inside your body', fact: 'Impossible! The cervix is too small for a tampon to pass through. It cannot go anywhere beyond the vaginal canal.', emoji: '😅' },
  { myth: 'Only girls need to know about periods', fact: 'Everyone benefits from understanding periods — partners, brothers, fathers, friends. Knowledge breaks stigma!', emoji: '👥' },
  { myth: 'Painful periods are always normal', fact: 'Some discomfort is normal but severe pain isn\'t. Conditions like endometriosis cause extreme pain and need treatment.', emoji: '🩺' },
]

const phases = [
  {
    name: 'Menstrual Phase',
    days: 'Day 1-5',
    emoji: '🌸',
    color: '#FBEAF0',
    textColor: '#993556',
    hormones: 'Estrogen & Progesterone LOW',
    body: 'Uterus sheds its lining. You may feel tired, have cramps, and lower energy.',
    mood: 'Introverted, reflective, need rest',
    tip: 'Rest, use heat therapy, eat iron-rich foods'
  },
  {
    name: 'Follicular Phase',
    days: 'Day 6-13',
    emoji: '🌱',
    color: '#E1F5EE',
    textColor: '#0F6E56',
    hormones: 'Estrogen RISING',
    body: 'Follicles develop in ovaries. Energy rises, skin clears up, you feel more social.',
    mood: 'Optimistic, energetic, creative',
    tip: 'Great time to start new projects and exercise hard!'
  },
  {
    name: 'Ovulation Phase',
    days: 'Day 14-16',
    emoji: '⭐',
    color: '#EEEDFE',
    textColor: '#534AB7',
    hormones: 'LH surges, Estrogen PEAKS',
    body: 'Egg released from ovary. You\'re at peak fertility. Energy and confidence are highest.',
    mood: 'Social, confident, attractive feeling',
    tip: 'Peak performance time — tackle your hardest challenges!'
  },
  {
    name: 'Luteal Phase',
    days: 'Day 17-28',
    emoji: '🌙',
    color: '#FEF3C7',
    textColor: '#854F0B',
    hormones: 'Progesterone RISES then drops',
    body: 'Body prepares for possible pregnancy. PMS symptoms may appear in last few days.',
    mood: 'May feel anxious, irritable, bloated',
    tip: 'Self care mode — reduce stress, eat well, sleep enough'
  },
]

const hormones = [
  { name: 'Estrogen', emoji: '💜', role: 'The feel-good hormone', desc: 'Makes you feel social, energetic and confident. Peaks during ovulation. When it drops, mood drops too.', color: '#EEEDFE', textColor: '#534AB7' },
  { name: 'Progesterone', emoji: '🌙', role: 'The calming hormone', desc: 'Rises after ovulation. Too much causes PMS symptoms like bloating, fatigue and mood swings before your period.', color: '#FEF3C7', textColor: '#854F0B' },
  { name: 'LH', emoji: '⚡', role: 'The ovulation trigger', desc: 'Luteinizing Hormone surges mid-cycle to trigger ovulation. This is what ovulation tests detect!', color: '#E1F5EE', textColor: '#0F6E56' },
  { name: 'FSH', emoji: '🌱', role: 'The follicle grower', desc: 'Follicle Stimulating Hormone helps eggs develop in the ovaries each month. Essential for fertility.', color: '#FBEAF0', textColor: '#993556' },
]

const awarenessTopics = [
  { title: 'What is a normal period?', emoji: '📏', content: 'A normal cycle is 21-35 days long. Periods last 2-7 days. Flow ranges from light to heavy. EVERY body is different — track yours to know YOUR normal. Comparing to others is not useful!' },
  { title: 'What is endometriosis?', emoji: '🔴', content: 'A condition where tissue similar to the uterine lining grows outside the uterus. Affects 1 in 10 people. Causes severe pain, heavy bleeding. Often goes undiagnosed for years. If your pain is extreme, please see a doctor.' },
  { title: 'What is PCOS?', emoji: '🔵', content: 'Polycystic Ovary Syndrome affects hormone levels, causing irregular periods, excess androgen, and small cysts on ovaries. Very common and manageable with lifestyle changes and medical treatment.' },
  { title: 'Period poverty is real', emoji: '🌍', content: 'Millions of people worldwide cannot afford period products, causing them to miss school and work. Period products should be a basic right. If you can, support period poverty initiatives in your community.' },
  { title: 'Mental health & periods', emoji: '🧠', content: 'PMDD (Premenstrual Dysphoric Disorder) is a severe form of PMS affecting mood significantly. It\'s a real medical condition. If you experience severe depression or anxiety before periods, speak to a doctor.' },
]

export default function Awareness() {
  const [activeTab, setActiveTab] = useState('myths')
  const [openMyth, setOpenMyth] = useState(null)
  const [openTopic, setOpenTopic] = useState(null)

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#FDF6F9' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#2D1B2E', fontWeight: 400, marginBottom: '0.5rem' }}>
            Know your <span style={{ fontStyle: 'italic', color: '#7B68CC' }}>body</span> 💡
          </h1>
          <p style={{ color: '#7A5C6E', fontSize: '15px', fontWeight: 300 }}>
            Break taboos, bust myths, and understand what's really happening inside
          </p>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '6px', background: '#F0EAF0', borderRadius: '50px', padding: '5px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[
            { val: 'myths', label: '🚫 Myth Busters' },
            { val: 'phases', label: '🔄 Cycle Phases' },
            { val: 'hormones', label: '🧬 Hormones' },
            { val: 'topics', label: '📚 Learn More' },
          ].map(tab => (
            <button key={tab.val} onClick={() => setActiveTab(tab.val)}
              style={{ flex: 1, border: 'none', background: activeTab === tab.val ? 'white' : 'transparent', color: activeTab === tab.val ? '#993556' : '#7A5C6E', padding: '10px 8px', borderRadius: '50px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: activeTab === tab.val ? 500 : 400, boxShadow: activeTab === tab.val ? '0 1px 8px rgba(153,53,86,0.12)' : 'none', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* MYTH BUSTERS */}
        {activeTab === 'myths' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(212,83,126,0.08), rgba(123,104,204,0.08))', border: '1px solid rgba(212,83,126,0.15)', borderRadius: '16px', padding: '1rem 1.25rem', marginBottom: '0.5rem' }}>
              <p style={{ color: '#7A5C6E', fontSize: '14px', fontWeight: 300, margin: 0 }}>
                🌍 800 million people menstruate every day. Yet myths and shame surround it. Let's bust them together!
              </p>
            </div>
            {myths.map((m, i) => (
              <div key={i} onClick={() => setOpenMyth(openMyth === i ? null : i)}
                style={{ background: 'white', border: `1px solid ${openMyth === i ? '#D4537E' : 'rgba(212,83,126,0.15)'}`, borderRadius: '16px', padding: '1.25rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{m.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: openMyth === i ? '10px' : 0 }}>
                      <span style={{ background: '#FEE2E2', color: '#991B1B', fontSize: '10px', padding: '2px 8px', borderRadius: '50px', fontWeight: 500 }}>MYTH</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#2D1B2E' }}>{m.myth}</span>
                    </div>
                    {openMyth === i && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '8px' }}>
                        <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '10px', padding: '2px 8px', borderRadius: '50px', fontWeight: 500, flexShrink: 0, marginTop: '2px' }}>FACT</span>
                        <p style={{ fontSize: '13px', color: '#7A5C6E', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>{m.fact}</p>
                      </div>
                    )}
                  </div>
                  <span style={{ color: '#D4537E', fontSize: '18px', flexShrink: 0 }}>{openMyth === i ? '▲' : '▼'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CYCLE PHASES */}
        {activeTab === 'phases' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '16px', padding: '1.25rem', textAlign: 'center', marginBottom: '0.5rem' }}>
              <p style={{ color: '#7A5C6E', fontSize: '14px', fontWeight: 300, margin: 0 }}>
                Your menstrual cycle has 4 distinct phases, each affecting your energy, mood, and body differently. Understanding them helps you work WITH your body, not against it! 🌙
              </p>
            </div>
            {phases.map((phase, i) => (
              <div key={i} style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ background: phase.color, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.8rem' }}>{phase.emoji}</span>
                    <div>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: phase.textColor, fontWeight: 400 }}>{phase.name}</div>
                      <div style={{ fontSize: '12px', color: phase.textColor, opacity: 0.8 }}>{phase.days}</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '50px', padding: '4px 12px', fontSize: '11px', color: phase.textColor, fontWeight: 500 }}>
                    {phase.hormones}
                  </div>
                </div>
                <div style={{ padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#7A5C6E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Your body</div>
                    <p style={{ fontSize: '13px', color: '#2D1B2E', lineHeight: 1.5, fontWeight: 300, margin: 0 }}>{phase.body}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#7A5C6E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Your mood</div>
                    <p style={{ fontSize: '13px', color: '#2D1B2E', lineHeight: 1.5, fontWeight: 300, margin: 0 }}>{phase.mood}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#7A5C6E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Pro tip</div>
                    <p style={{ fontSize: '13px', color: phase.textColor, lineHeight: 1.5, fontWeight: 400, margin: 0 }}>💡 {phase.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HORMONES */}
        {activeTab === 'hormones' && (
          <div>
            <div style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: '#7A5C6E', fontSize: '14px', fontWeight: 300, margin: 0 }}>
                Hormones are chemical messengers that control your cycle. Understanding them helps explain why you feel different at different times of the month! 🧬
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {hormones.map((h, i) => (
                <div key={i} style={{ background: 'white', border: '0.5px solid rgba(212,83,126,0.15)', borderRadius: '20px', overflow: 'hidden' }}>
                  <div style={{ background: h.color, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '2rem' }}>{h.emoji}</span>
                    <div>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: h.textColor, fontWeight: 400 }}>{h.name}</div>
                      <div style={{ fontSize: '12px', color: h.textColor, opacity: 0.8, fontWeight: 300 }}>{h.role}</div>
                    </div>
                  </div>
                  <div style={{ padding: '1rem 1.25rem' }}>
                    <p style={{ fontSize: '13px', color: '#7A5C6E', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEARN MORE */}
        {activeTab === 'topics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {awarenessTopics.map((topic, i) => (
              <div key={i} onClick={() => setOpenTopic(openTopic === i ? null : i)}
                style={{ background: 'white', border: `1px solid ${openTopic === i ? '#7B68CC' : 'rgba(212,83,126,0.15)'}`, borderRadius: '16px', padding: '1.25rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{topic.emoji}</span>
                  <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: '#2D1B2E' }}>{topic.title}</span>
                  <span style={{ color: '#7B68CC', fontSize: '18px' }}>{openTopic === i ? '▲' : '▼'}</span>
                </div>
                {openTopic === i && (
                  <p style={{ fontSize: '13px', color: '#7A5C6E', lineHeight: 1.7, fontWeight: 300, margin: '12px 0 0 0', paddingTop: '12px', borderTop: '0.5px solid rgba(212,83,126,0.1)' }}>
                    {topic.content}
                  </p>
                )}
              </div>
            ))}

            {/* Break the taboo section */}
            <div style={{ background: 'linear-gradient(135deg, rgba(212,83,126,0.08), rgba(123,104,204,0.08))', border: '1px solid rgba(212,83,126,0.15)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center', marginTop: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: '#2D1B2E', fontWeight: 400, marginBottom: '0.5rem' }}>
                Talk about it. Break the taboo.
              </h3>
              <p style={{ color: '#7A5C6E', fontSize: '13px', fontWeight: 300, lineHeight: 1.7, margin: 0 }}>
                Periods are natural. Talking about them shouldn't be uncomfortable. Share FlowBuddy with someone who needs it — a friend, a brother, a partner. Knowledge is the best gift. 🌸
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}