const mongoose  = require("mongoose");
const bcrypt = require(bcrypt);

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
    },
    isAdmin:{
        type:Boolean,
        default:false,
    }
},
    {timestamps:true}
);


userSchema.methods.matchPassword = async function(enteredPass){
    return bycrypt.compare(enteredPass, this.password);
}

// Hash Password before save
userSchema.pre("save" , async function(next){

    if (!this.isModified){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userModel);
module.exports=User;