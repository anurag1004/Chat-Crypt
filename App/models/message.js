const mongoose = require('mongoose')
const InboxMessageSchema = new mongoose.Schema({
    text: String,
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    time : { type : Date, default: Date.now }
})
const OutboxMessageSchema = new mongoose.Schema({
    text: String,
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    time : { type : Date, default: Date.now }
})
module.exports = { InboxMessageSchema, OutboxMessageSchema}