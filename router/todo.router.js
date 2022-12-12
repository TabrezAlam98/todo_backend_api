const express=require("express")
const {TodosModel}=require("../Model/todo.model")

const todoRouter=express.Router();

todoRouter.get("/todo",async(req,res)=>{
    const todos=await TodosModel.find()
    res.send(todos)
})

todoRouter.post("/create",async(req,res)=>{
    const payload=req.body;
    try{
        const todos=new TodosModel(payload);
        await todos.save()
        res.send("todos created")
    }
    catch(err){
        res.send("something went wrong")
    }
})


todoRouter.delete("/delete/:todoID",async(req,res)=>{
    const todoID=req.params.todoID;
    try
    {
      await TodosModel.findByIdAndDelete({_id:todoID})
      res.send("todo deleted")
    }
    catch(err){
        res.send("something went wrong")
    }
})
todoRouter.put("/update/:todoID",async(req,res)=>{
    const todoID=req.params.todoID;
    const payload=req.body;
    try
    {
      await TodosModel.findByIdAndUpdate({_id:todoID},payload)
      res.send("todo updated")
    }
    catch(err){
        res.send("something went wrong")
    }
})

module.exports={todoRouter}