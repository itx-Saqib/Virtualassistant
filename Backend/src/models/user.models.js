const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:true,
    minlength:3
},
email:{
    type:String,
    required:true,
    unique:true,
},
password:{
       type:String,
    required:true,
    minlength:8
},
assistantName:{
     type:String,
},
assistantImage:{
    type:String,
},
history:[
    {type:String}
]
},{timestamps:true})

const User = mongoose.model('user',userSchema)

module.exports = User ;