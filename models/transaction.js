const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  _id: {type: String,required: true},
  date: {type: String,required: true},
  description: {type: String,required: true },
  amount: {type: Number, required: true},
  type: { type: String, enum: ['credit', 'debit'],required: true},
  category: { type: String,required: true}
}, { _id: false })

module.exports = mongoose.model('Transaction', transactionSchema)

