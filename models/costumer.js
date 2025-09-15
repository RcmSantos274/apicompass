const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    cpf: {type: String, require: true, unique: true},
    email:{type:  String, required: true}
}, { _id: false })

module.exports = mongoose.model("Costumer", customerSchema)
