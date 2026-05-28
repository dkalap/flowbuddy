const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// LOG A NEW CYCLE
const logCycle = async (req, res) => {
  const { startDate, endDate, flowLevel, painLevel, notes } = req.body

  try {
    const cycle = await prisma.cycle.create({
      data: {
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        flowLevel,
        painLevel: painLevel ? parseInt(painLevel) : null,
        notes,
        userId: req.user.id
      }
    })
    res.status(201).json(cycle)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET ALL CYCLES FOR USER
const getCycles = async (req, res) => {
  try {
    const cycles = await prisma.cycle.findMany({
      where: { userId: req.user.id },
      orderBy: { startDate: 'desc' },
      include: { symptoms: true }
    })
    res.json(cycles)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET SINGLE CYCLE
const getCycle = async (req, res) => {
  try {
    const cycle = await prisma.cycle.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      include: { symptoms: true }
    })
    if (!cycle) return res.status(404).json({ message: 'Cycle not found' })
    res.json(cycle)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// UPDATE CYCLE
const updateCycle = async (req, res) => {
  const { endDate, flowLevel, painLevel, notes } = req.body

  try {
    const cycle = await prisma.cycle.updateMany({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      data: {
        endDate: endDate ? new Date(endDate) : null,
        flowLevel,
        painLevel: painLevel ? parseInt(painLevel) : null,
        notes
      }
    })
    res.json({ message: 'Cycle updated ✅' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// DELETE CYCLE
const deleteCycle = async (req, res) => {
  try {
    await prisma.cycle.deleteMany({
      where: { id: parseInt(req.params.id), userId: req.user.id }
    })
    res.json({ message: 'Cycle deleted ✅' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET CYCLE STATS (for dashboard)
const getCycleStats = async (req, res) => {
  try {
    const cycles = await prisma.cycle.findMany({
      where: { userId: req.user.id },
      orderBy: { startDate: 'desc' }
    })

    if (cycles.length === 0) {
      return res.json({ message: 'No cycles logged yet' })
    }

    // calculate average cycle length
    let totalDays = 0
    let count = 0
    for (let i = 0; i < cycles.length - 1; i++) {
      const diff = new Date(cycles[i].startDate) - new Date(cycles[i + 1].startDate)
      totalDays += diff / (1000 * 60 * 60 * 24)
      count++
    }

    const avgCycleLength = count > 0 ? Math.round(totalDays / count) : 28
    const lastPeriod = cycles[0]
    const nextPeriodDate = new Date(lastPeriod.startDate)
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength)

    res.json({
      totalCycles: cycles.length,
      avgCycleLength,
      lastPeriodStart: lastPeriod.startDate,
      nextPredictedPeriod: nextPeriodDate,
      daysSinceLastPeriod: Math.round(
        (new Date() - new Date(lastPeriod.startDate)) / (1000 * 60 * 60 * 24)
      )
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { logCycle, getCycles, getCycle, updateCycle, deleteCycle, getCycleStats }