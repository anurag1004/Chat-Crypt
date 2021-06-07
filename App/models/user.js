const mongoose = require('mongoose')
const {InboxMessageSchema,  OutboxMessageSchema} = require('./message')
const userSchema = new mongoose.Schema({
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
    inbox : [InboxMessageSchema],
    outbox :[OutboxMessageSchema]
});
module.exports = mongoose.model("User",userSchema);