var express = require("express");
var app = express();
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = ( new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);
var mongoose = require("mongoose");
var passportMongoose = require("passport-local-mongoose");
var User = require("./models/user");
var List = require("./models/list");
var session = require("express-session");
var passport = require("passport");
var localStrategy = require("passport-local");
var passportMongoose = require("passport-local-mongoose")
var bodyParser = require("body-parser");
var seedDB = require("./seeds");

//seedDB();
mongoose.connect("mongodb://localhost/todolist");
app.use(session({
    secret:"todolist",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.get("/", function(req,res){
    res.render("home");
});

// index
app.get("/list", isLoggedIn, function(req,res){
   res.render('list');
});

app.post("/list", isLoggedIn, function(req,res){
    var content = req.body.content;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newList = {content: content, author:author}
    List.create(newList, function(err, newCreate){
        if(err){
            console.log(err);
        } else{
            res.redirect('/list')
        }
    });
});

app.get("/register", function(req,res){
    res.render("register");
});
app.post("/register", function(req,res){
    User.register(new User({username: req.body.username}),req.body.password, function(err, user){
      if(err) {
          console.log(err);
          return res.render("/register");
      }  
      passport.authenticate("local")(req,res,function(){
          res.redirect("/list");
      });
    })
})

app.get("/login", function(req,res){
    res.render("login");
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/list",
    failureRedirect: "/login"
}));

app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(5000, process.env.IP, function(){
    console.log("Server has started");
});