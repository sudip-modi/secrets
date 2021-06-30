//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(
  express.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const user = new mongoose.model("user", userSchema);

app.get("/", function (req, response) {
  response.render("home");
});

app.get("/login", function (req, response) {
  response.render("login");
});

app.get("/register", function (req, response) {
  response.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new user({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  user.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password == password) {
          res.render("secrets");
        }
      }
    }
  });
});
app.listen(3000, function () {
  console.log("server running on port 3000");
});
