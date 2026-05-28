const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const {
  logSymptom,
  getSymptoms,
  getSymptomsByCycle,
  updateSymptom,
  deleteSymptom
} = require('../controllers/symptomController')

router.use(protect)

router.post('/', logSymptom)
router.get('/', getSymptoms)
router.get('/cycle/:cycleId', getSymptomsByCycle)
router.put('/:id', updateSymptom)
router.delete('/:id', deleteSymptom)

module.exports = router