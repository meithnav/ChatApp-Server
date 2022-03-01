const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User= require("../models/userModel");

const protect = asyncHandler(async (req,res)=> {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
        // console.log("TOKEN : " , req.headers.authorization);
        token = req.headers.authorization.split(" ")[1];

        // Decode the token to get the User obj
        const decoded = jwt.verify(token , process.env.SECRET_KEY);
        console.log("process.env.SECRET_KEY : ", process.env.SECRET_KEY)
        console.log("NAME : ", decoded.name)
        req.user = await User.findById(decoded._id).select("-password");
        next(); 


        }catch(err){
            res.status(401)
            throw new Error("Not Authorized!!")
        }
    }
    
    
    if(!token){
        res.status(401)
        throw new Error("No token Found. Not Authorized");
    }

});

module.exports = {protect}

