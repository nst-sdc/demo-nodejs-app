require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// setup mongoose 
mongoose.connect(process.env.MONGODB_URI, {
  authSource: "admin",
}).then(() => {
  console.log('Connected to MongoDB')
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error)
})

// setup express
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Welcome to the server! Use /users to get/post users. This endpoint accepts GET and POST requests. For POST requests, send a JSON object with a \'name\' key like { "name": "Arpit Sarang" }')
})

// setup a single sample route with mongodb
const User = mongoose.model('User', { name: String })

app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/users', async (req, res) => {
  const newUser = new User({ name: req.body.name })

  try {
    const savedUser = await newUser.save()
    res.json(savedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('*', (req, res) => {
  res.redirect('/')
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})