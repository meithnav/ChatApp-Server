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

app.use(express.json())

// ROUTERS
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);


// Error Handling middlewares -- 
// NOTE: location is imp as all of the above code does not run then it will come here.
app.use(notFound);
app.use(errorHandler);


app.listen(PORT , console.log(`SERVER listening to PORT : ${PORT}`));

