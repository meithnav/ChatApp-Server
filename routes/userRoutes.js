const express = require("express");
const userRouter = express.Router();
const {allUsers , registerUser, authUser} = require("../controllers/userContoller");
const {protect} = require("../middleware/authMiddleware");

userRouter.route("/").get(protect, allUsers);
userRouter.route("/").post(registerUser);
userRouter.post("/login" , authUser);

module.exports = userRouter ;
