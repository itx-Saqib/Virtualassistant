require('dotenv').config('')
const app = require('./src/app')
const connectDB = require('./src/DB/db')
const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    connectDB();
    console.log(`server is running on ${PORT}`)
})