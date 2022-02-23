const mongoose = require("mongoose");
const express = require("express");

 const BookingRouter = require("./router/booking.js");
 const ownerRouter = require("./router/ownerrouter.js");
const userRouter = require("./router/userrouter.js");
const venueRouter = require("./router/venuerouter.js");
const app = express();

app.use(express.json());

// app.use("/venueBooking", venueBookingRouter);
 app.use("/user", userRouter);
 app.use("/owner", ownerRouter);
 app.use("/booking",BookingRouter)
 app.use("/venue",venueRouter)
//DB Connection



  mongoose
    .connect('mongodb+srv://Vikash12345:Vikash12345@cluster0.cyvdu.mongodb.net/myFirstDatabase2?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Mongodb connected successfully");
    });




app.listen(5000, (req, res) => {
  console.log(`server is listening on 5000`);
});