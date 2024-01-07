const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
var fs = require('fs')

var privateKey = process.env.JWR_SECERET

//saving prefs
router.post('/prefs', authenticateToken, async (req, res) =>{
    var x = JSON.stringify(req.body)
  
    fs.writeFile('./private/adminprefs/colors.txt', x, (err) => {
        if (err)
            res.status(400).json({message: err.message})
        else {
            res.sendStatus(201)
        }
    });
})

router.get('/prefs', async (req, res) =>{
    try{
        var prefs = await fs.readFileSync('./private/adminprefs/colors.txt') //stringified json
        res.json(JSON.parse(prefs))
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/prefs/location', authenticateToken, async (req, res) =>{
    var x = JSON.stringify(req.body)
  
    fs.writeFile('./private/adminprefs/location.txt', x, (err) => {
        if (err)
            res.status(400).json({message: err.message})
        else {
            res.sendStatus(201)
        }
    });
})
router.get('/prefs/location', async (req, res) =>{
    try{
        var prefs = await fs.readFileSync('./private/adminprefs/location.txt') //stringified json
        res.json(JSON.parse(prefs))
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router;

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
