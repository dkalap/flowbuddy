const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// SIGNUP
const signup = async (req, res) => {
  const { name, email, password, gender } = req.body

  try {
    // check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, gender }
    })

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      token: generateToken(user.id)
    })

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      token: generateToken(user.id)
    })

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, gender: true, dob: true, createdAt: true }
    })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

//Update Profile
const updateProfile = async (req, res) => {
  const { name, dob, gender } = req.body
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, gender, dob: dob ? new Date(dob) : null },
      select: { id: true, name: true, email: true, gender: true, dob: true }
    })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

//changing password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' })
    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } })
    res.json({ message: 'Password changed successfully!' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { signup, login, getProfile, updateProfile, changePassword }