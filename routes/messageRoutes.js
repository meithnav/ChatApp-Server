const express = require("express");
const messageRouter = express.Router();

const {protect} = require("../middleware/authMiddleware")
const {sendMessage, fetchAllMessages}  = require("../controllers/messageControllers")

messageRouter.route("/").post(protect, sendMessage);
messageRouter.route("/:chatId").get(protect, fetchAllMessages);


module.exports = messageRouter;