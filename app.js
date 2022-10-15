const dotenv = require('dotenv')
const express = require('express');
const users = require('./models/users');
require('./connect/dbconfig');
const products = require('./models/products');
const jwt = require('jsonwebtoken');
const app = express();
dotenv.config();
const auth = require('./auth');


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
app.post('/login', auth,  async (req, res) => {
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
app.get('/product/:id', async (req, res) => {
    let result = await products.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    } else {
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

// Update Product API
app.put('/updateProduct/:id', async (req, res) => {
    let result = await products.updateOne({ _id: req.params.id }, { $set: req.body });
    res.send(result);
})

// Search Product API
app.get('/search/:key', async(req, res)=>{
    let result = await products.find({
        "$or":[
            {
                name : { $regex: req.params.key }
            },
            {
                company : { $regex: req.params.key }
            },
            {
                category : { $regex: req.params.key }
            }
        ]
    })
    res.send(result);
})

const createtoken = async()=>{
    const token = await jwt.sign({ _id:"634a91ec2de432cc42aca435"}, "task_app", {
        expiresIn : "1 hr"
    });
    console.log(token);

    const userVer = await jwt.verify(token, "task_app");
    console.log(userVer);
}
createtoken();


app.listen(process.env.PORT || 5000);

