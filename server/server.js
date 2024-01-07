require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

mongoose.connect(process.env.DATABASE_URL, { })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to database"))

app.use(express.json())
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

const AirPollutionRouter = require('./routes/air_pollution') 
app.use('/air_pollution', AirPollutionRouter)

const UserRouter = require('./routes/user')
app.use('/user', UserRouter)

const AdminRouter = require('./routes/admin')
app.use('/admin', AdminRouter)

app.listen(80, () => console.log('Server Started'))
