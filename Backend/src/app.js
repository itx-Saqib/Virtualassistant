const express = require('express')
const askGemini = require('./gemini')
const authRoute = require('./routes/auth.route')
const cors = require('cors');
const cookie = require('cookie-parser')
const userRoute = require('./routes/user.route')
const app = express();
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(cookie());
app.use('/api/auth',authRoute)
app.use('/api/user',userRoute)


module.exports = app;