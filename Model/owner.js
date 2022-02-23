const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const ownerSchema = new Schema(
  {
    name: { type: String, required: [true, "Please enter name"] },
    email: {
      type: String,
      lowercase: true,
      unique: [true, `Account with is email id already exists`],
      required: [true, "Email is required"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: { type: String, required: true, minlength: 8 },
    tokens: [
      {
        token: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ownerSchema.methods.generateAuthToken = async function () {
  const owner = this;
  const token = jwt.sign({ _id: owner._id.toString() }, "vikashyadavsamja");
  owner.tokens.push({ token });
  await owner.save();
  return token;
};

ownerSchema.statics.findByCredentials = async (email, password) => {
  const owner = await ownerModel.findOne({ email });
  if (!owner) throw new Error("Unable to login");

  const isMatch = await bcrypt.compare(password, owner.password);
  if (!isMatch) throw new Error("Password is incorrect");
  return owner;
};

ownerSchema.pre("save", async function (next) {
  const owner = this;

  if (owner.isModified("password")) {
    owner.password = await bcrypt.hash(owner.password, 8);
  }

  next();
});

const ownerModel = mongoose.model("Owner", ownerSchema);

module.exports = ownerModel;