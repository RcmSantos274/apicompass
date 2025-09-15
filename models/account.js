const mongoose = require("mongoose")

const accountSchema =  new mongoose.Schema({
    _id: {type: String, required: true},
    type: {type: String, required: true},
    branch: {type:String, required: true},
    number: {type:String, required: true, unique: true},
    balance: {type: Number, default: 0.00},
    transactions:[{type: String, ref: "Transaction"}]
}, { _id: false })

module.exports = mongoose.model("Account", accountSchema)