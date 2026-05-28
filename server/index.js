require('dotenv').config()
const express = require('express')
const cors = require('cors')


const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// test route
app.get('/', (req, res) => {
  res.json({ message: 'FlowBuddy API is running 🌸' })
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/periods', require('./routes/periods'))
app.use('/api/chat', require('./routes/chat'))
app.use('/api/symptoms', require('./routes/symptoms'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`FlowBuddy server running on port ${PORT} 🌸`))