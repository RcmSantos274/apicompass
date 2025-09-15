const express = require('express')
const router = express.Router()
const Account = require('apicompass/models/account')
const Customer = require('apicompass/models/customer')
const { generateAccountId, generateAccountNumber } = require('apicompass/utils/generators')

router.post('/customers/:customerId/accounts', async (req, res) => {
  try {
    const { customerId } = req.params
    const { type, branch } = req.body
    
    if (!type || !branch) {
      return res.status(400).json({
        error: 'Tipo e agência são obrigatórios'
      })
    }
    
    const customer = await Customer.findById(customerId)
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' })
    }
    
    const accountId = await generateAccountId()
    const accountNumber = generateAccountNumber()
    
    const account = new Account({
      _id: accountId,
      type,
      branch,
      number: accountNumber,
      balance: 0.00,
      transactions: []
    })
    
    await account.save()
    
    customer.accounts.push(accountId);
    await customer.save()
    
    res.status(201).json(account)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id/balance', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)
    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' })
    }
    
    res.json({
      accountId: account._id,
      balance: account.balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router