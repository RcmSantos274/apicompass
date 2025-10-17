const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const { generateCustomerId } = require('../utils/generators')

router.post('/', async (req, res) => {
  try {
    const { name, cpf, email } = req.body
    
    if (!name || !cpf || !email) {
      return res.status(400).json({
        error: 'Nome, CPF e email são obrigatórios'
      })
    }
    
    const customerId = await generateCustomerId()
    
    const customer = new Customer({
      _id: customerId,
      name,
      cpf,
      email,
      accounts: []
    })
    
    await customer.save()
    
    res.status(201).json(customer)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'CPF ou email já cadastrado'
      })
    }
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' })
    }
    res.json(customer)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
