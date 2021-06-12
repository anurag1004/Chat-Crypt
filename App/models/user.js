const mongoose = require('mongoose')
// const {InboxMessageSchema,  OutboxMessageSchema} = require('./message')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        unique: false,
        trim: true,
        required: true
    },
    lastName : {
        type:String,
        unique:false,
        trim:true,
        required:true
    },
    username : {
        type: String,
        required: true,
        unique : true,
        trim : true
    },
    password : {
        type:String,
        required: true,
        trim: true
    },
    // will contain all received messages
    inbox : [{ msg:{
                type: String,
                trim: true
             },
               from: {
                   type: String,
                   trim: true
               },
               time : { type : Date, default: Date.now }
            }],
    outbox :[{ msg:{
                type: String,
                trim: true
               },
               to: {
                    type: String,
                    trim: true
                },
                time : { type : Date, default: Date.now }
            }]
});
module.exports = mongoose.model("User",userSchema);