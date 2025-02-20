require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const app = express()
//config JSON response 

app.use(express.json())

//Models
const User = require('./models/User')
//Register User

app.post('/auth/register', async(req,res) =>{
    const{ name, email, password, confirmpassword} = req.body

    //Validações 

    if(!name){
        return res.status(422).json({msg: 'O nome é obrigatório!'})
    }
    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }
    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatória!'})
    }
    if(!confirmpassword){
        return res.status(422).json({msg: 'A confirmação da senha é obrigatoria'})
    }
     
    
})


// 

const dbUser = process.env.DB_USER
const dbpassword = process.env.DB_PASS

mongoose
.connect(`mongodb+srv://${dbUser}:${dbpassword}@cluster0.eqjcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    app.listen(3000)
    console.log('Conectaco ao banco')
}).catch((err) => console.log(err))
