const dotenv = require("dotenv");
dotenv.config();
const express=require('express')
const app=express()
const users=require('./routes/user-routes')
const connectdb=require('./db/db')
connectdb()
const cors = require("cors");
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a secret from your environment variables
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, // Session valid for 1 hour (3600000 milliseconds)
  })
);
app.use('/users',users);
app.get("/",(req,res)=>{
    res.send("Hello World")
})
module.exports=app