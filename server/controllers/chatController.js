const Groq = require('groq-sdk')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const chat = async (req, res) => {
  const { message } = req.body

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are FlowBuddy, a warm supportive AI companion for a period tracking app.
          You help ALL users — girls, boys, partners, parents — understand menstrual health without shame or taboo.
          Answer questions about periods, PMS, cramps, ovulation, hormones in simple friendly language.
          Keep answers concise (2-4 sentences). Use occasional gentle emojis 🌸💕
          Never provide serious medical advice — recommend seeing a doctor for medical concerns.`
        },
        { role: 'user', content: message }
      ],
      max_tokens: 300
    })

    const answer = response.choices[0].message.content

    await prisma.chatLog.create({
      data: { question: message, answer, userId: req.user.id }
    })

    res.json({ answer })

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const getChatHistory = async (req, res) => {
  try {
    const logs = await prisma.chatLog.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    res.json(logs)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { chat, getChatHistory }