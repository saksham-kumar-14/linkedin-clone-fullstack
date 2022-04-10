const mongoose = require("mongoose");

const post_schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    time:{
        type:String,
        required:true
    },
    likes:{
        type:Number,
        required:true
    },
    people_liked:{
        type:Array,
        required:true
    }
})

const post_model = mongoose.model("posts", post_schema);
module.exports =post_model