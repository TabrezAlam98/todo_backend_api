
const express =require("express");
const app=express();
const {UserModel}=require("./Model/user.model")
const {connection}=require("./config/db")
const {todoRouter}=require("./router/todo.router")
const {authenticate}=require("./middleware/authentication")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()
const cors = require('cors')
app.use(express.json())
app.use(cors())
app.use(cors({
    origin : "*"
}))

app.get("/",async(req,res)=>{
    const user=await UserModel.find()
    res.send(user)
})


app.post("/signup", async (req, res) => {
    const {email, password,name} = req.body;
    const userPresent = await UserModel.findOne({email})
    if(userPresent){
        res.send("Try loggin in, already exist")
    }
    try{
        bcrypt.hash(password, 4, async function(err, hash) {
            const user = new UserModel({email,password:hash,name})
            await user.save()
            res.send("Sign up successfull")
        });
       
    }
   catch(err){
        console.log(err)
        res.send("Something went wrong, pls try again later")
   }
})




app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await UserModel.find({email})
         
      if(user.length > 0){
        const hashed_password = user[0].password;
        bcrypt.compare(password, hashed_password, function(err, result) {
            if(result){
                const token = jwt.sign({"userID":user[0]._id}, 'hush');
                res.send({"msg":"Login Successfull","token" : token})
            }
            else{
                res.send("Login failed")
            }
      })} 
      else{
        res.send("Login failed")
      }
    }
    catch{
        res.send("Something went wrong, please try again later")
    }
})

app.use(authenticate)
app.use('/todo',todoRouter)


app.listen(process.env.Port,async()=>{
    try{
        await connection;
        console.log('connected DB')
    }catch(err){
        console.log(err);
        console.log('something went wrong')
    }
    console.log(`listening on port ${process.env.Port}`)
})