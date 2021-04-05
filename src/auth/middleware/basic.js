'use strict';

const base64 = require('base-64');
const User = require('../models/users.js');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }
  
  let basic = req.headers.authorization.split(' ').pop();
  // console.log(basic,"---------basic----")
  let [user, pass] = base64.decode(basic).split(':');
  try {
req.user = await User.authenticateBasic(user, pass)
// console.log(a,"---------user----")
// res.status(201)
    next();
  } catch (e) {
    res.status(403).send('Invalid Login');
  }

}

