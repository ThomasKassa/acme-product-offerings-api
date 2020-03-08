const express = require('express')
const app = express()
app.use(express.json())
const db = require('./db')
const path = require('path');
const { Product, Company, Offering } = db.models

app.get('/', (req, res, next)=> {
    res.sendFile(path.join(__dirname, 'index.html'));
  });


app.get('/api/companies', async(req, res, next) =>{
    const companies = await Company.findAll()
    res.send(companies)
})


app.get('/api/products', async(req, res, next) =>{
    const products = await Product.findAll()
    res.send(products)
})

app.get('/api/offerings', async(req, res, next) =>{
    const offerings = await Offering.findAll()
    res.send(offerings)
})


app.use((err, res, next) => {
    res.status(500).send({message: err.message})
})
const port = process.env.PORT || 3000

db.sync()
.then( () => {
    
    app.listen(port, () => {`Listenging on port ${port}`})
})

module.exports = app;