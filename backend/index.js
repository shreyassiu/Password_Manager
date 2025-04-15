const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const authRouter = require('./Routes/authRouter')
const ProductRouter = require('./Routes/ProductRouter')
require('./Models/db')

const app = express()
const PORT =  8080

app.use(bodyParser.json())
app.use(cors())


app.use('/auth',authRouter)
app.use('/products',ProductRouter);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})