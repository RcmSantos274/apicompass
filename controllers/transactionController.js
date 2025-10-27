const Transaction = require('../models/transaction');
const Account = require('../models/account');
const { generateTransactionId } = require('../utils/generators');

// Criar nova transação
const createTransaction = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { description, amount, type, category } = req.body;
    
    if (!description || !amount || !type || !category) {
      return res.status(400).json({
        error: 'Descrição, valor, tipo e categoria são obrigatórios'
      });
    }
    
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }
    
    if (type === 'debit' && account.balance < amount) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }
    
    const transactionId = await generateTransactionId();
    
    const transaction = new Transaction({
      _id: transactionId,
      date: new Date().toISOString().split('T')[0],
      description,
      amount,
      type,
      category
    });
    
    await transaction.save();
    
    if (type === 'credit') {
      account.balance += amount;
    } else {
      account.balance -= amount;
    }
    
    account.transactions.push(transactionId);
    await account.save();
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar transações de uma conta
const listTransactions = async (req, res) => {
  try {
    const { accountId } = req.params;
    
    const account = await Account.findById(accountId).populate('transactions');
    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }
    
    const transactions = await Transaction.find({
      _id: { $in: account.transactions }
    }).sort({ date: -1 });
    
    res.json({
      accountId,
      balance: account.balance,
      transactions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTransaction,
  listTransactions
};
