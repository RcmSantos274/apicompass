const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/:accountId/transactions', transactionController.createTransaction);
router.get('/:accountId/transactions', transactionController.listTransactions);

module.exports = router;
