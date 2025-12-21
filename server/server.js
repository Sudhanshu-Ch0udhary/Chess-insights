import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import mongoose from 'mongoose'

configDotenv()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: '*' }))

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  })

// Healthcheck route
app.get('/api/health', (_req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Chess Review System API is running',
    timestamp: new Date().toISOString()
  })
})

app.listen(port, () => {
  console.log(`Server running on PORT ${port}!!!`);
})

export default app