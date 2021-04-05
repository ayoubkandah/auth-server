'use strict';

const express = require('express');
const authRouter = express.Router();
const jwt = require("jsonwebtoken")
let generator = require('generate-password');
const bcrypt = require('bcrypt');

const User = require('./models/users.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')

authRouter.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    // console.log(user)
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    

    // console.log(userRecord,"------")
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {

  const user = {
    user: req.user,
    token: req.user.token
  };


  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, async (req, res, next) => {
  const users = await User.find({});
  // console.log(user.username,"------------")
  // console.log(req.user,"------------")
  // console.log(users)

  // console.log(password);
  // console.log(users)
  const list = users.filter(function (user){
    // console.log(user,"------------")
   if(req.user.username==user.username){
    //  console.log("ssss")
return true
   }else{
     return false;
   }
    
  }) 
  // console.log(list,'---------')
  res.status(200).json(list[0]);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  
  const token = req.headers.authorization.split(' ').pop();
  const validUser = await User.authenticateWithToken(token);
  let password = generator.generate({
    length: 10,
    numbers: true
  });
  let bcryptPass=await bcrypt.hash(password,10);
// try{  // console.log(validUser,"-------------")
 let aa = await User.find({ "_id": validUser.id, "username":validUser.username,"password":validUser.password, }).updateOne({
  "$set": { "password": `${bcryptPass}` } 
});
// console.log(aa,"---eeeeeeeeeeeeeeee---------")


// console.log("-------------",aa,"------------")
  res.status(200).json({  newPassword : password,YourUsername:validUser.username })

  // } catch(err){
//   throw new Error
// }
});
// const users =  User.find({});
// console.log(user.username,"------------")
// console.log(req.user,"------------")

// console.log(users)

module.exports = authRouter;
