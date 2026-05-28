
const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const {
  logCycle,
  getCycles,
  getCycle,
  updateCycle,
  deleteCycle,
  getCycleStats
} = require('../controllers/periodController')

router.use(protect) // all period routes are protected

router.post('/', logCycle)
router.get('/', getCycles)
router.get('/stats', getCycleStats)
router.get('/:id', getCycle)
router.put('/:id', updateCycle)
router.delete('/:id', deleteCycle)


router.get('/', (req, res) => {
  res.json({ message: 'Periods route working 🌸' })
})
module.exports = router



