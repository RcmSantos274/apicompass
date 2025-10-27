const Account = require('../models/account');
const Customer = require('../models/customer');
const { generateAccountId, generateAccountNumber } = require('../utils/generators');

// Criar nova conta
const createAccount = async (req, res) => {
  try {
    const { customerId, type, branch } = req.body;
    
    if (!customerId || !type || !branch) {
      return res.status(400).json({
        error: 'ID do cliente, tipo e agência são obrigatórios'
      });
    }
    
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    const accountId = await generateAccountId();
    const accountNumber = generateAccountNumber();
    
    const account = new Account({
      _id: accountId,
      type,
      branch,
      number: accountNumber,
      balance: 0.00,
      transactions: []
    });
    
    await account.save();
    
    customer.accounts.push(accountId);
    await customer.save();
    
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Consultar saldo
const getBalance = async (req, res) => {
  try {
    const account = await Account.findById(req.params.accountId);
    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }
    
    res.json({
      accountId: account._id,
      balance: account.balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar detalhes completos da conta
const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.accountId)
      .populate('transactions');
    
    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }
    
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar conta
const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.accountId);
    
    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }
    
    // Verificar se a conta tem saldo
    if (account.balance !== 0) {
      return res.status(400).json({ 
        error: 'Não é possível deletar conta com saldo diferente de zero' 
      });
    }
    
    // Verificar se a conta tem transações
    if (account.transactions && account.transactions.length > 0) {
      return res.status(400).json({ 
        error: 'Não é possível deletar conta com transações' 
      });
    }
    
    // Remover referência da conta no cliente
    await Customer.updateMany(
      { accounts: account._id },
      { $pull: { accounts: account._id } }
    );
    
    await Account.findByIdAndDelete(req.params.accountId);
    
    res.json({ message: 'Conta deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAccount,
  getBalance,
  getAccountById,
  deleteAccount
};
