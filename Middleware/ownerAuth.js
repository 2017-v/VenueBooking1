const jwt = require("jsonwebtoken");
const Owner = require("../Model/owner.js");

const ownerAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "vikashyadavsamja");
    const owner = await Owner.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!owner) {
      throw new Error("You are not auhthorize to access it");
    }

    req.token = token;
    req.owner = owner;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = ownerAuth;