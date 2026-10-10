const authController = require('../controllers/auth.controller')
const express = require('express')
const route = express.Router();
route.post('/register',authController.signUp)
route.post('/login',authController.logIn)
route.get('/logout',authController.logout)

module.exports = route 