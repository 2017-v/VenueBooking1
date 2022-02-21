const express = require("express");
const auth = require("../Middleware/auth.js")
const userModel = require ("../Model/user.js");
const userRouter = express.Router();

userRouter.post("/signup", async (req,res)=>{
    const newUser = new userModel(req.body);
    try {
      await newUser.save();
      const token = await newUser.generateAuthToken();
      res.status(201).json({ newUser, token });
    } catch (err) {
      res.status(400).json(err.message);
    }
});
userRouter.post("/login", async (req,res)=>{
    try {
        const user = await userModel.findByCredentials(
          req.body.email,
          req.body.password
        );
        const token = await user.generateAuthToken();
        res.status(200).json({ user, token });
      } catch (err) {
        res.status(400).json(err.message);
      }
});

userRouter.post("/logout", auth, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
          return token.token !== req.token;
        });
        await req.user.save();
    
        res.status(200).send("User logged out");
      } catch (e) {
        res.status(500).send("Something went wrong");
      }
});

module.exports = userRouter;