const dotenv = require("dotenv");
dotenv.config();
const express=require('express')
const cookieparser=require('cookie-parser')
const app=express()
const users=require('./routes/user-routes')
const connectdb=require('./db/db')
const session = require("express-session");
app.use(cookieparser())
connectdb()
const cors = require("cors");
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/users',users);
app.get("/",(req,res)=>{
    res.send("Hello World")
})
module.exports=app