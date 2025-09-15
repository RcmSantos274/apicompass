const express = require('express')
const cors = require('cors')
const connectDB = require('apicompass/config/database')

const customersRoutes = require('apicompass/routes/customers')
const accountsRoutes = require('apicompass/routes/accounts')
const transactionsRoutes = require('apicompass/routes/transactions')

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API Bancária funcionando!' })
})

app.use('/customers', customersRoutes)
app.use('/', accountsRoutes)
app.use('/', transactionsRoutes)
 
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})