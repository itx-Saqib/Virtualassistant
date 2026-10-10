const express = require('express')
const isAuth = require('../middleware/isAuth')
const route = express.Router();
const upload = require('../middleware/multer')
const userController = require('../controllers/user.controller')



route.get('/current',isAuth,userController.getCurrentUser)
route.post('/update',isAuth,upload.single('assistantImage'),userController.updateAssistant)
route.post('/askToAssistant',isAuth,userController.askToAssistant )

module.exports = route;