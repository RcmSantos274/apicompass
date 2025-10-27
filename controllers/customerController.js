const Customer = require('../models/customer');
const { generateCustomerId } = require('../utils/generators');

// Criar novo cliente
const createCustomer = async (req, res) => {
  try {
    const { name, cpf, email } = req.body;
    
    if (!name || !cpf || !email) {
      return res.status(400).json({
        error: 'Nome, CPF e email são obrigatórios'
      });
    }
    
    const customerId = await generateCustomerId();
    
    const customer = new Customer({
      _id: customerId,
      name,
      cpf,
      email,
      accounts: []
    });
    
    await customer.save();
    
    res.status(201).json(customer);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'CPF ou email já cadastrado'
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Listar todos os clientes
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar cliente por ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar cliente
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    // Verificar se o cliente tem contas
    if (customer.accounts && customer.accounts.length > 0) {
      return res.status(400).json({ 
        error: 'Não é possível deletar cliente com contas ativas' 
      });
    }
    
    await Customer.findByIdAndDelete(req.params.customerId);
    
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  deleteCustomer
};  
