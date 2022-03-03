const express =  require("express") ;
const app = express();

const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const connectDB = require("./config/db");
connectDB();
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");
const path = require('path');
app.use(express.json())

// ROUTERS
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);


// ----  deployment -----



// ----  deployment -----


// Error Handling middlewares -- 
// NOTE: location is imp as all of the above code does not run then it will come here.
app.use(notFound);
app.use(errorHandler);


const server = app.listen(PORT , console.log(`SERVER listening to PORT : ${PORT}`));

const io = require("socket.io")(server , {
    // Amt of time it will wait while being inactive (in ms)
    pingTimeout:60000,
    cors:{
        // So that we don't have CORS error later
        origin:"http://localhost:3000",
    },
});

io.on("connection", (socket)=>{
    console.log(`Connected to socket.io`);

    socket.on("setup" , (userData)=> {
        // Addng user to the room 
        socket.join(userData._id);
        socket.emit("Connected");
    });


    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("join chat" , (room)=>{
        socket.join(room);
        console.log(`USER joined ROOM : `, room);
    });

    socket.on("new message" , (newMessageRecieved)=>{
        const chat = newMessageRecieved.chat;

        if(!chat.users){
            return console.log("Chat users undefined!!  CHAT: ", chat);
        }
        
        chat.users.forEach(user => {
            
            if(user._id == newMessageRecieved.sender._id ) return ;

            socket.in(user._id).emit("message recieved" , newMessageRecieved);

        });
    });

    socket.off("setup", ()=>{
        console.log(`USER DISCONNECTED`);
        socket.leave(userData._id);
    });

});
