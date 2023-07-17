//jshint esversion:6
const express = require("express");
const body_parser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(body_parser.urlencoded({extended : true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser : true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

secret = "Thisisalittlesecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields : ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email : req.body.username,
        password : req. body.password
    });

    newUser.save().then(() => {
        res.render("secrets");
    }).catch((err) => {
        console.log(err);
    });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const passwords = req.body.password;

    User.findOne({email : username}).then((foundUser) => {
        if(foundUser) {
            if(foundUser.password === passwords) {
                res.render("secrets");
            }else {
                alert("Incorrect email or password!!");
            }
        }else {
            console.log("User not found.");
        }
    }).catch((err) => {
        console.log(err);
    });
});
 
app.listen(3000, function(req, res) {
    console.log("Server is running in port 3000");
});