require('dotenv').config()

const dbUser = process.env.DB_USER;

const dbpassword = process.env.DB_PASS;

export{dbUser, dbpassword}