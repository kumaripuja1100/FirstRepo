//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});



userSchema.plugin(encrypt, {secret: process.env.MYPASSWORD, encryptedFields: ["password"]});

console.log(process.env.MYPASSWORD);

const AddedUser = new mongoose.model("AddedUser", userSchema);

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

    const newUser = new AddedUser({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err) {
        if(!err)
            res.render("secrets");
        else
            console.log(err);
    });


});

app.post("/login", function(req, res) {

    const username = req.body.username;
    const password = req.body.password;

    AddedUser.findOne({email: username}, function(err, correctUser) {
        if(err)
            console.log(err);
        else
            if(correctUser)
                if(correctUser.password === password)
                    res.render("secrets");
    });

});


app.listen(3000, function() {
    console.log("server is running on port 3000.");
});