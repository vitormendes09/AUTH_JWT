const mongoose = require('mongoose')

const User = mongoose('User', {
    name:String,
    email: String,
    password: String
})

module.exports = User