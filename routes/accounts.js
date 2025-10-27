const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.post('/', accountController.createAccount);
router.get('/:accountId/balance', accountController.getBalance);
router.get('/:accountId', accountController.getAccountById);
router.delete('/:accountId', accountController.deleteAccount);

module.exports = router;






