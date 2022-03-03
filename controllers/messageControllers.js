const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");


const fetchAllMessages = asyncHandler(async (req, res)=>{
        const {chatId} = req.params;
        try{
            const allMsgs = await Message.find({chat:chatId})
            .populate("sender", "name pic email")
            .populate("chat");
            
            res.status(200).json(allMsgs);

        }catch(err){
            res.status(400);
            throw new Error(err.message);
        }
});

const sendMessage = asyncHandler(async (req, res)=>{

    const {chatId , content} = req.body;
    if(!chatId || !content){
        // return res.status(400)
        res.status(400);
        throw new Error("Please Enter all the fields!!");
    }

    const msgData = {
        sender:req.user._id,
        content:content,
        chat: chatId
    }

    try{

        var newMsg = await Message.create(msgData);

        newMsg = await newMsg.populate("sender", "name pic");
        newMsg = await newMsg.populate("chat");

        newMsg = await User.populate(newMsg, {
        path: "chat.users",
        select: "name pic email",

        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: newMsg });
        
        res.status(200).json(newMsg);
        // res.status(200).send(newMsg);

    }catch(err){
        res.status(400);
        throw new Error(error.message); 
    }

});



module.exports = {fetchAllMessages ,sendMessage} ;