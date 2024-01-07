const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
var fs = require('fs')

var privateKey = process.env.JWR_SECERET

//PASSWORD MUST BE ENCODED FROM CLIENT - IT IS CURRENTLY NOT AS THIS IS JUST FOR THE MEANTIME AS A PROOF OF CONCEPT
router.post('/login', async (req, res) => {
    let user = await User.where("username").equals(req.body.username).where("password").equals(req.body.password)

    //console.log(user)
    if (!user.length) {
        return res.status(401).json("Invalid username and password")
    }
    else {
        const accessToken = jwt.sign({
            id: user[0]._id,
            username: user[0].username
        }, privateKey, { expiresIn: '365d' })
        res.cookie('Authorization', accessToken)
        res.status(200)
        return res.json({ accessToken: accessToken })
    }
})

router.post('/logout', authenticateToken, async (req, res) => {
    res.clearCookie('Authorization');
    res.sendStatus(200)
})

router.post('/register', async (req, res) => {
    try {
        // Check username
        if (!!(await User.where("username").equals(req.body.username)).length) {
            return res.status(400).json({ message: err.message })
        }

        // Add user
        const entry = new User({
            username: req.body.username,
            password: req.body.password
        })

        const user = await entry.save()
        const accessToken = jwt.sign({
            id: user._id,
            username: user.username
        }, privateKey, { expiresIn: '365d' })
        res.status(200).json({ accessToken: accessToken })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Getting one entry
router.get('/:id', getUser, async (req, res) => {
    res.status(403)
})

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: "Cannot find user" })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.user = user
    next()
}

module.exports = router

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    else {
        jwt.verify(token, privateKey, (err, user) => {
            if (err) return res.sendStatus(403)
            else {
                req.user = user
                next()
            }
        })
    }
}
