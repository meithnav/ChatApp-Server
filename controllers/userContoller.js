const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");


// Fetch Users
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

// Register New User
const registerUser = asyncHandler(async (req, res) => {

    const {email, name, password, pic} = req.body;

    // Check If any empty field
    if(!name || !email || !pic || !password){
        res.status(400);
        throw new Error("Please Enter all the fields!!");
    }

    // Check If User already exists
    const findUser = await User.findOne({email}) ; 
    if(findUser){
        res.status(400);
        throw new Error("User already exists!!!");
    }

    // Create New User
    const user = await User.create({
        name, email, password, pic
    })

    // Send the user data on success
    if(user){
        res.status(200).json({
            _id:user._id,
            name:user.name, 
            email:user.email, 
            password: user.password, 
            pic: user.pic,
            token: generateToken(user._id),

        });
    }else{
        res.status(400);
        throw new Error("User unable to save!!");
    }

});


// Login User
const authUser = asyncHandler(async (req, res)=> {

    const {email, password} = req.body;

    // Check If any empty field
    if(!email|| !password){
        res.status(400);
        throw new Error("Please Enter all the fields!!");
    }

    const verifyUser = await User.findOne({email}) ; 
    if( verifyUser && (await verifyUser.matchPassword(password)) ){
        res.status(200).json({
            _id:verifyUser._id,
            name:verifyUser.name, 
            email:verifyUser.email, 
            password: verifyUser.password, 
            pic: verifyUser.pic,
            token: generateToken(verifyUser._id),
        });


    }else{
        res.status(401);
        throw new Error("Invalid Email or Password!!");  
    }


});

module.exports = {allUsers, registerUser, authUser} ;