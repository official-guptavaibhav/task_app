const jwt = require('jsonwebtoken');
const users = require('./models/users')
// User Authetication using JWT Token
const auth = async (req, res, next)=>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, "task_app");
        console.log(verifyUser);

        const user = await users.findOne({_id:verifyUser._id})
        console.log(user);
        next();
    }catch{
        res.status(401).send(error);
    }
}

module.exports = auth;