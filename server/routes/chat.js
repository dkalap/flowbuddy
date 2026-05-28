const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { chat, getChatHistory } = require('../controllers/chatController')

router.use(protect)

router.post('/', chat)
router.get('/history', getChatHistory)


router.get('/', (req, res) => {
  res.json({ message: 'Chat route working 🌸' })
})

module.exports = router

