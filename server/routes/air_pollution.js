const express = require('express')
const router = express.Router()
const AirPollution = require('../models/air_pollution')
const jwt = require('jsonwebtoken')
var fs = require('fs')

var privateKey = process.env.JWR_SECERET


router.get('/geo', async (req, res) =>{
    AirPollution.aggregate([{
        $geoNear: {
          near: {
            'type': 'Point',
            'coordinates': [parseFloat(req.query.coordx), parseFloat(req.query.coordy)]
          },
          distanceField: "dist.calculated",
          maxDistance: parseFloat(req.query.dist),
          spherical: true
        }
      }]).then((AirPollutions) => {
        res.send(AirPollutions);
      });
})

//Getting all entries
router.get('/', async (req, res) =>{
    try{
        const airpollution = await AirPollution.find()
        res.json(airpollution)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Getting all entries with a given name
router.get('/name', async (req, res) =>{
    try{
        const airpollutions = await AirPollution.find({ name: `${req.query.name}` })
        res.json(airpollutions)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Creating one entry
router.post('/', async (req, res) =>{
    const entry = new AirPollution({
        name: req.body.name,
        region: req.body.region,
        geo: {
            "coordinates":[
                req.body.longtitude,
                req.body.latitude,
            ]
        },
        source: req.body.source,
        reliability: req.body.reliability,
        concentrations: {
            PM10: req.body.PM10,
            PM2_5: req.body.PM2_5,
            SO2: req.body.SO2,
            CO: req.body.CO,
            O3: req.body.O3,
            NO2: req.body.NO2,
            C6H6: req.body.C6H6,
        },
        date_time_of_measurement: {
            measuring_start: req.body.measuring_start,
            measuring_end: req.body.measuring_end,
        },
    })

    try{
        const newEntry = await entry.save()
        res.status(200).json(newEntry)
    }
    catch (err){
        res.status(400).json({message: err.message})
    }
})

//Updating one specific entry - probably won't be added - not needed - potentially hazardous - for now 404 not found.
router.patch('/:id', (req, res) =>{
    res.status(404)
})

//Deleting one specific entry - may be added in the future - potentially hazardous - for now 404 not found.
router.delete('/:id', (req, res) =>{
    res.status(404)
})
//Getting one specific entry
router.get('/:id', getAirPollution, async (req, res) =>{
    res.send(res.air_pollution)
})

module.exports = router

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, privateKey, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

async function getAirPollution(req, res, next){
    let air_pollution
    try{
        air_pollution = await AirPollution.findById(req.params.id)
        if(air_pollution == null){
            return res.status(404).json({message: "Cannot find air pollution"})
        }
    }
    catch (err){
        return res.status(500).json({ message: err.message})
    }

    res.air_pollution = air_pollution
    next()
}