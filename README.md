# FlowBuddy 🌸

> Your gentle cycle companion — for every body, breaking taboos, one period at a time.

![FlowBuddy Banner](https://img.shields.io/badge/FlowBuddy-Period%20Tracker-pink?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-blue?style=for-the-badge&logo=postgresql)

---
## 🌟 About FlowBuddy

FlowBuddy is a full-stack menstrual health web application built to break the taboo around periods. It's not just for girls — it's for **everyone** who wants to understand, support, or learn about menstrual health.

---
## ✨ Features

### 🗓️ Period Tracker
- Interactive calendar to log period days
- Click any date to view or add logs
- Automatic cycle predictions and fertile window calculation
- Ovulation day detection
- Stats: days since last period, cycle length, next period countdown

### 💬 AI Chatbot
- Powered by **Groq API + Llama 3.3 70B** 
- Ask anything about periods, hormones, PMS, cramps
- Completely judgment-free safe space
- Chat history saved to your account
- Works for everyone — not just those who menstruate!

### 🧘 Exercise Guide
- Personalized exercises based on cramp level
- 4 levels: No cramps → Mild → Moderate → Severe
- Yoga poses with YouTube tutorial links
- General tips for exercising during periods

### 🥗 Care & Food Guide
- Day-by-day period care guide
- Foods to eat and avoid during periods (with reasons!)
- Self-care tips for each day

### 💡 Awareness & Education
- Myth busting (8 common period myths debunked!)
- 4 cycle phases explained simply
- Topics: Endometriosis, PCOS, Period poverty, PMDD

### 🎮 Stress Relief Games
- **Bubble Challenge** — Pop only the target color bubble! 3 difficulty levels, streak multiplier, high score
- **Catch the Good Stuff** — Catch healthy period foods, avoid bad ones! Real-time basket movement, 3 difficulty levels

- ### 👥 Inclusive Design
- Male users get a special onboarding (tracking for partner/daughter(s)/sister(s)/learning)
- Dynamic greeting based on gender
- No gendered language forced on anyone
- Designed for everyone, not just women

### 👤 Profile
- Edit name, date of birth, gender
- Change password
- View account stats (cycles logged, avg cycle, AI chats)
- Member since date

---
## 🗄️ Database Schema
User
├── id, name, email, password (hashed)
├── gender, dob
└── createdAt, updatedAt

Cycle
├── id, startDate, endDate
├── flowLevel, painLevel, notes
└── userId (→ User)

Symptom
├── id, date, mood
├── cramps, bloating, headache, fatigue, backPain
├── notes
└── userId (→ User), cycleId (→ Cycle)

ChatLog
├── id, question, answer
├── createdAt
└── userId (→ User)

---
## 🚧 Future Roadmap
v2.0
├── 🌐 Hindi + multilingual support
├── 📧 Email notifications & period reminders
├── 🗑️ Delete account feature
├── 📊 Analytics dashboard with charts
├── 📱 PWA (install on phone like native app)
├── 🤝 Share cycle data with partner/doctor
├── 📝 Period journal/notes
├── 🏆 Achievements & streaks system
└── 🔐 Forgot password via email

---

## 👩‍💻 Author

**Dhanashri Kalap**
- GitHub: [@dkalap](https://github.com/dkalap)
- LinkedIn: [Dhanashri Kalap](https://linkedin.com/in/dhanashri-kalap)

---
## 📄 Disclaimer

FlowBuddy is a menstrual health tracking and awareness platform built for educational purposes. It is **not a medical app** and should not replace professional medical advice. Always consult a qualified healthcare provider for medical concerns.

---
