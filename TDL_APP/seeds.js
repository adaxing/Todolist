var mongoose = require("mongoose");
var User = require("./models/user");
var List = require("./models/list");



function seedDB(){
    List.remove({}, function(err){
    if(err){
        console.log(err);
    }
    console.log("removed lists");
    });
}

module.exports = seedDB;