const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req,res, next)=> {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        
        try{
        // console.log("TOKEN : " , req.headers.authorization);
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await User.findById(decoded.id).select("-password");
        next(); 

        }catch(error){
            res.status(401)
            throw new Error("Not Authorized!! Token failed")
        }
    }
    
    
    if(!token){
        res.status(401)
        throw new Error("No token Found. Not Authorized");
    }

});

module.exports = {protect}

