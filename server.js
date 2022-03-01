const express =  require("express") ;
const app = express();

const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const connectDB = require("./config/db");
connectDB();
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRouter = require("./routes/userRoutes");

// const {chats} = require('./data/data')


app.use(express.json())

// ROUTERS
app.use("/api/user", userRouter);


// app.get('/', (req, res) => {
//         res.send("Hello Home");

// });

// app.get('/api/chats', (req, res) => {
//         res.send(chats);

// });

// app.get('/api/chat/:id', (req, res) => {
//         const id = req.params.id ;

//         const chat = chats.find((c) => c._id === req.params.id);

//         if(chat){
//             res.send(chat);
//         }else{
//             res.send("ERROR...")
//         }
// });
   

// Error Handling middlewares -- 
// NOTE: location is imp as all of the above code does not run then it will come here.
app.use(notFound);
app.use(errorHandler);


app.listen(PORT , console.log(`SERVER listening to PORT : ${PORT}`));

