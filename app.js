const dotenv= require('dotenv')
const express = require('express');
require('./connect/dbconfig')
const user = require('./models/users')
const app = express();
dotenv.config();


app.post('/register', (req, res)=>{
    res.send("Register API")
})
app.listen(process.env.PORT || 5000);

