const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const customersRoutes = require('./routes/customers');
const accountsRoutes = require('./routes/accounts'); 
const transactionsRoutes = require('./routes/transactions'); 

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Bancária funcionando!' });
});

app.use('/customers', customersRoutes);
app.use('/accounts', accountsRoutes); 
app.use('/transactions', transactionsRoutes); 

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
