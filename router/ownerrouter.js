const express = require("express");
const ownerAuth = require("../Middleware/ownerAuth.js")
const ownerModel = require ("../Model/owner.js");
const ownerRouter = express.Router();

ownerRouter.post("/signup", async (req,res)=>{
    const newowner = new ownerModel(req.body);
    try {
      await newowner.save();
      const token = await newowner.generateAuthToken();
      res.status(201).json({ newowner, token });
    } catch (err) {
      res.status(400).json(err.message);
    }
});
ownerRouter.post("/login", async (req,res)=>{
    try {
        const owner = await ownerModel.findByCredentials(
          req.body.email,
          req.body.password
        );
        const token = await owner.generateAuthToken();
        res.status(200).json({ owner, token });
      } catch (err) {
        res.status(400).json(err.message);
      }
});

ownerRouter.post("/logout", ownerAuth, async (req,res)=>{
    try {
        req.owner.tokens = req.owner.tokens.filter((token) => {
          return token.token !== req.token;
        });
        await req.owner.save();
    
        res.status(200).send("owner logged out");
      } catch (e) {
        res.status(500).send("Something went wrong");
      }
});

module.exports = ownerRouter;