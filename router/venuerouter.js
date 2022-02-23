const express = require("express");
const ownerAuth = require("../Middleware/ownerAuth.js");
const venueModel = require("../Model/venueModel.js");

const venueRouter = express.Router();


venueRouter.get("/fetchAllVenue", async(req,res)=>{
    try {
        const venues = await venueModel.find({});
        if (venues) res.status(200).json({ venues });
        else res.status(404).json({ message: "No venue found." });
      } catch (e) {
        res.status(500).send("Error: " + e.message);
      }

});


venueRouter.get("/fetchVenue/:id", async(req,res)=>{
    const { id } = req.params;
  try {
    const venue = await venueModel.findById(id);
    if (venue) res.status(200).json({ venue });
    else res.status(404).json({ message: "No venue found." });
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
});


venueRouter.post("/addVenue", ownerAuth, async(req,res)=>{
    const newVenue = new venueModel({ ...req.body, owner: req.owner._id });
    try {
      await newVenue.save();
      res.status(201).send(newVenue);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error: " + err.message);
    }
});

venueRouter.patch("/editVenue/:id", ownerAuth, async(req,res)=>{
    const { id } = req.params;

    try { 
      const updateVenue = await venueModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (updateVenue) res.status(201).send(updateVenue);
      else res.status(404).send("Not Found");
    } catch (err) {
      res.status(500).send("Error: " + err.message);
    }
});


venueRouter.delete( "/deleteVenue/:id", ownerAuth, async(req,res)=>{
    const { id } = req.params;
    try {
      const data = await venueModel.findByIdAndDelete(id);
      if (data) res.status(200).send(`Venue deleted with id:${id}`);
      else {
        res.status(404).send(`Venue with id:${id} does not exist`);
      }
    } catch (err) {
      res.status(500).send("Error: " + err.message);
    }
});

module.exports = venueRouter;