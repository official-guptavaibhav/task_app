const dotenv = require('dotenv')
const express = require('express');
const users = require('./models/users');
require('./connect/dbconfig');
const products = require('./models/products');
const app = express();
dotenv.config();


app.use(express.json());

// User Registration API
app.post('/register', async (req, res) => {
    let user = new users(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    res.send(result);
})

// User Login API
app.post('/login', async (req, res) => {
    if (req.body.password && req.body.email) {
        let user = await users.findOne(req.body).select('-password');
        if (user) {
            res.send(user);
        } else {
            res.send("No User Found")
        }
    } else {
        res.send("Invalid")
    }
})

// Add Product API
app.post('/addProduct', async (req, res) => {
    let product = new products(req.body);
    let result = await product.save();
    res.send(result);
})


// Fetch Single Product
app.get('/product/:id',async(req, res)=>{
    let result = await products.findOne({_id: req.params.id});
    if(result){
        res.send(result);
    }else{
        res.send("No Product Found");
    }
})

// Fetch Products List API 
app.get('/products', async (req, res) => {
    const product = await products.find();
    if (product.length > 0) {
        res.send(product);
    } else {
        res.send("No Product Found")
    }
})


// Delete Product API
app.delete('/deleteProduct/:id', async (req, res) => {
    let result = await products.deleteOne({ _id: req.params.id })
    res.send(result)
})
app.listen(process.env.PORT || 5000);

