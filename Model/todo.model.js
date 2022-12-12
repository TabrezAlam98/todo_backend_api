const mongoose=require("mongoose");

const todosSchema=mongoose.Schema({
   taskname:String,
   status:String,
   tag:String
})

const TodosModel=mongoose.model('todo',todosSchema)

module.exports={TodosModel}