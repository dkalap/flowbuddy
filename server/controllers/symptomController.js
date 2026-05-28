const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// LOG SYMPTOMS
const logSymptom = async (req, res) => {
  const { date, mood, cramps, bloating, headache, fatigue, backPain, notes, cycleId } = req.body

  try {
    const symptom = await prisma.symptom.create({
      data: {
        date: new Date(date),
        mood,
        cramps: cramps || false,
        bloating: bloating || false,
        headache: headache || false,
        fatigue: fatigue || false,
        backPain: backPain || false,
        notes,
        userId: req.user.id,
        cycleId: cycleId ? parseInt(cycleId) : null
      }
    })
    res.status(201).json(symptom)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET ALL SYMPTOMS FOR USER
const getSymptoms = async (req, res) => {
  try {
    const symptoms = await prisma.symptom.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    })
    res.json(symptoms)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET SYMPTOMS BY CYCLE
const getSymptomsByCycle = async (req, res) => {
  try {
    const symptoms = await prisma.symptom.findMany({
      where: {
        userId: req.user.id,
        cycleId: parseInt(req.params.cycleId)
      },
      orderBy: { date: 'desc' }
    })
    res.json(symptoms)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// UPDATE SYMPTOM
const updateSymptom = async (req, res) => {
  const { mood, cramps, bloating, headache, fatigue, backPain, notes } = req.body

  try {
    await prisma.symptom.updateMany({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      data: { mood, cramps, bloating, headache, fatigue, backPain, notes }
    })
    res.json({ message: 'Symptom updated ✅' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// DELETE SYMPTOM
const deleteSymptom = async (req, res) => {
  try {
    await prisma.symptom.deleteMany({
      where: { id: parseInt(req.params.id), userId: req.user.id }
    })
    res.json({ message: 'Symptom deleted ✅' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { logSymptom, getSymptoms, getSymptomsByCycle, updateSymptom, deleteSymptom }