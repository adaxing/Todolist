var mongoose = require("mongoose");
var passportMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    passport: String,
    
});


userSchema.plugin(passportMongoose);
module.exports = mongoose.model("User", userSchema);
