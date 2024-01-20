const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./contollers/blogRouter')
const config = require('./utils/config')
const logger = require('./utils/logger')

logger.info('Connecting to MongoDB', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected')
  })
  .catch(() => {
    logger.error('Could not connect')
  })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)

module.exports = app