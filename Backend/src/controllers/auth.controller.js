const User = require('../models/user.models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const signUp = async (req,res) =>{
    try {
        const {name,email,password} = req.body;
        if(!name||!password||!email){
            return res.status(409).json({message:"all fields are required."})
        }
        if(name.length < 3 ){
            return res.status(401).json({message:"name must be at least 3 letters"})
        }
        if(password.length < 8 ){
            return res.status(401).json({message:"password must be at least 8 character"})
        }
        const userAlreadyExist = await User.findOne({email}) ;
        if(userAlreadyExist){
            return res.status(400).json({message:"user already register"})
        }
        const hashPassword = await bcrypt.hash(password,10)
        const user = await User.create({name,email,password:hashPassword});
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7 *24*60*60*1000
        })
        user.password = undefined;
        res.status(201).json({message:"user register successfully!",user})
    } catch (error) {
        res.status(500).json({message:"Internal server error."})
    }
}
const logIn=async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email ||!password){
            return res.status(409).json({message:'all fields are required.'})
        }
        if(password.length < 8){
        return res.status(400).json({message:"password must be at least 8 letters"})
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"user not found."})
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
        return res.status(401).json({message:"inCorrect password"})
        } 
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
             secure:true,
            sameSite:"none",
            maxAge:7 *24*60*60*1000
        })
        user.password = undefined;
     return   res.status(200).json({message:"user login successfully!",user})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
         secure:true,
            sameSite:"none",
    });

    return res.status(200).json({
      message: "User logged out successfully.",
    });

  } catch (error) {
    console.log("Logout error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {signUp,logIn,logout}
