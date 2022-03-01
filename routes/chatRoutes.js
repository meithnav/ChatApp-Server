const express = require("express");
const chatRouter = express.Router();
const {protect} = require("../middleware/authMiddleware")
const {accessChat, fetchChats,createGroup, renameGroup, removeFromGroup, addToGroup} 
 = require("../controllers/chatController")

chatRouter.route("/").get(protect, fetchChats);
chatRouter.route("/").post(protect, accessChat);
chatRouter.route("/group").post(protect, createGroup);
chatRouter.route("/groupadd").put(protect, addToGroup);
chatRouter.route("/rename").put(protect, renameGroup);
chatRouter.route("/groupremove").put(protect, removeFromGroup);


module.exports = chatRouter;