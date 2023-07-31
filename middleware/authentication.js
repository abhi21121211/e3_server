const {UserModel }=require("../models/User.model")

require("dotenv").config

const jwt =require("jsonwebtoken");
const authentication = (req,res,next)=>{
    const token =req.headers.authorization?.split(" ")[1]
    if(!token){
        res.json("pleas login first")
    }else{
        jwt.verify(token,process.env.SECRET_KEY,async function(err,decoded){
            if(err){
                res.json("pleas login")
            }else{
                const user_id = decoded.user_id
                req.user_id=user_id
                next();
            }
        })
    }
}

module.exports={authentication}