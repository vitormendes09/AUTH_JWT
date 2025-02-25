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


//Open Route - publi Rote
app.get('/',( req,res) => {
    res.status(200).json({msg: 'Hello Word'})
})

// Private Route
app.get('/users/:id', async (req, res) => {
    const id = req.params.id
    try{

        //chek if user exixts
    const user = await User.findById(id, '-password')

    if(!user){
        return res.status(404).json({msg: 'usuário não encontrado.'})
    }

    res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor, pfvr entre em contato!', error })
    }
    
})


function checkToken(req, res, next){
    const authHeader = req.headres['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    

    if(!token){
        return res.status(401).json({msg: 'Acesso negado!'})
    }

    try{




        const secret = process.env.SECRET

        jwt.verify(token , secret)

        next()
    } catch(err){
        res.status(400).json({msg: 'Token inválido!'})
    }
}
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

    if(password !== confirmpassword){
        return res.status(422).json({msg: 'Suas senhas estão diferentes'})
    }
     

  //check if user exists

  const userExists = await User.findOne({ email: email})

  if(userExists){
    return res.status(422).json({msg: 'Este email já foi cadastrado!'})
  }


  //create password

  const salt = await bcrypt.genSalt(12)
  const passHash = await bcrypt.hash(password, salt)


  //create user

  const user = new User({
    name,
    email,
    password: passHash
  })

  try{

    await user.save()

    res.status(201).json({msg: 'Usuário criado com sucesso!'})

  }catch(error){

    console.log(error)
    res.status(500).json({msg: 'Erro no servidor, pfvr entre em contato!'})
  }
})


app.post("/auth/login", async(req, res) => {
    const {email,password  } = req.body

    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }
    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatória!'})
    }

    // check if user exists

    const user = await User.findOne({email: email})

    if(!user){
        return res.status(422).json({msg: 'Usuário não encontrado'})
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        return res.status(422).json({msg: 'Senha incorreta!'})
    }

    try{

        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id,
        },

        secret, 
    )   

    res.status(200).json({ msg: 'Autenticação realizada com sucesso!' , token })

    }catch(err){
        console.log(err)
        res.status(500).json({msg: 'Aconteceu um erro na autenticação do servidor, pfvr entre em contato'})
            
      
    }
})

// Credencials

const dbUser = process.env.DB_USER
const dbpassword = process.env.DB_PASS

mongoose
.connect(`mongodb+srv://${dbUser}:${dbpassword}@cluster0.eqjcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    app.listen(3000)
    console.log('Conectaco ao banco')
}).catch((err) => console.log(err))
