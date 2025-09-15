const Customer = require('apicompass/models/customer')
const Account = require('apicompass/models/account')
const Transaction = require('apicompass/models/transaction')

const generateCustomerId = async () => {
  const count = await Customer.countDocuments()
  return `cus_${String(count + 1).padStart(3, '0')}`
}

const generateAccountId = async () => {
  const count = await Account.countDocuments();
  return `acc_${String(count + 1).padStart(3, '0')}`
}

const generateAccountNumber = () => {
  const number = Math.floor(Math.random() * 90000) + 10000
  const digit = Math.floor(Math.random() * 10)
  return `${number}-${digit}`
};

const generateTransactionId = async () => {
  const count = await Transaction.countDocuments()
  return `txn_${String(count + 1).padStart(3, '0')}`
}

module.exports = {
  generateCustomerId,
  generateAccountId,
  generateAccountNumber,
  generateTransactionId
}