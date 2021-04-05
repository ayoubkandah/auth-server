'use strict';

const users = require('../models/users.js')

module.exports = async (req, res, next) => {

  try {

    if (!req.headers.authorization) { next('Invalid Login') }

    const token = req.headers.authorization.split(' ').pop();
    // console.log(token,"----------------")
    const validUser = await users.authenticateWithToken(token);
    // console.log(validUser.token,"-------------")

// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFrMzMiLCJpYXQiOjE2MTc2MzE5MDZ9.upo2yYjtoMa0LdVlxkJjDFSOuijAX55qWhly-4I5C30""

req.user = validUser;

    req.token = validUser.token;
next()
  } catch (e) {
    res.status(403).send('Invalid Login');;
  }
}
