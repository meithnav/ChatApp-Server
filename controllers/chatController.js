const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// One on One Chat
const accessChat = asyncHandler (async (req, res)=> {

    const {userId} = req.body; 

    if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat:false, 
        $and : [
            {users: {$elemMatch : {$eq:req.user._id}}},
            {users: {$elemMatch : {$eq:userId}}},
        ]
    })
    .populate("users", "-password")
    .populate("latestMessage") ;

    isChat = User.populate(isChat , {
        path:"latestMessage.sender",
        select:"name pic email"
    })

    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        // Create New Chat
        const chatData = {
            chatName:"sender",
            isGroupChat:false,
            users:[
                req.user._id,
                userId
            ]
        }

        try{
        const newChat = await Chat.create(chatData);

        const FullChat = await Chat.findOne({_id:newChat._id})
        .populate("users", "-password");

        res.status(200).send(FullChat);
            

        }catch(err){
            res.status(400);
            throw new Error(err.message);
        }

    }


});


const fetchChats = asyncHandler(async (req, res)=>{

    try{
        Chat.find({users:{$elemMatch: {$eq:req.user._id} }})
        .populate("users", "-password" )
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async (results)=> {
            results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
        });
        res.status(200).send(results);

    });

    }catch(err){
        res.status(400);
        throw new Error(error.message);
    }
    

});


// create Group Chat

const createGroup = asyncHandler(async (req, res)=>{

    // Pass users =>array, groupname => name
    if(!req.body.users || !req.body.name){
        return res.status(400).send("Fill all the fields");
    }

    var users = JSON.parse(req.body.users);
    if(users.length<2){
        return res.status(400).send("More than 2 members needed in a group")
    }

    users.push(req.user);

    try{

        const GroupChat = await Chat.create({
            chatName: req.body.name,
            groupAdmin:req.user,
            users:users,
            isGroupChat:true,
        });
        const fullGroupChat = await Chat.findOne({_id:GroupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

        res.status(200).send(fullGroupChat);


    }catch(err){
        res.status(400);
        throw new Error(error.message);
    }

});

// Rename
const renameGroup = asyncHandler(async (req, res)=>{

    const {chatId , chatName} = req.body
    if(!chatId || !chatName){
        return res.status(400).send("Please fill all the fields.");
    }

    const updateChat = await Chat.findByIdAndUpdate({_id:chatId}, {chatName:chatName}, {new:true} )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!updateChat){
        res.status(404)
        throw new Error("Chat not found!!")
    }else{
        res.status(200).send(updateChat) ;
        // res.status(200).json(updateChat) ;
    }
});

// Remove from Group
const removeFromGroup = asyncHandler(async (req, res)=> {
    
    const {chatId , userId} = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId,{$pull: {users: userId }}, {new: true,})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).send(removed) ;
        // res.json(removed);
    }

});

// Add user to Group
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(chatId,{$push: { users: userId }}, {new: true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});



module.exports = {accessChat, fetchChats, createGroup, renameGroup,removeFromGroup, addToGroup}
