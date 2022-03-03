const mongoose  = require("mongoose");
const bcrypt = require("bcrypt");

const userModel = mongoose.Schema({

    name:{
        type:String, 
        trim:true,
        required:true,
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    pic: {
        type:String,
        default:"https://res.cloudinary.com/dmpnxmwnr/image/upload/v1646304241/profile_ue3iiv.png"
    },
    isAdmin:{
        type:Boolean,
        default:false,
    }
},
    {timestamps:true}
);


userModel.methods.matchPassword = async function(enteredPass){
    return bcrypt.compare(enteredPass, this.password);
}

// Hash Password before save
userModel.pre("save" , async function(next){

    if (!this.isModified){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
});

const User = mongoose.model("User", userModel);
module.exports=User;