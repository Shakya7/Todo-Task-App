const Todo = require("../models/todoModel");

exports.createSingleTodo=async (req,res)=>{
    //const {title}=req.body;
    try{
    const newTodo=await Todo.create(req.body);
    console.log("Created a new id of ",newTodo._id);
    res.status(201).json({
        status:"success",
        data:{
            todo:newTodo
        }
    })
    }catch(err){
        res.status(400).json({
            status:"failed",
            message: err.message
        })
    }
}
exports.getTodo=async(req,res)=>{
    try{
        const todo=await Todo.findById(req.params.id).populate("tasks");
        res.status(200).json({
            status:"success",
            data:{
                todo
            }
        })
    }catch(err){
        res.status(400).json({
            status:"failed",
            message: err.message
        })
    }
}

exports.getAllTodos=async (req,res)=>{
    try{
        const {id}=req.params;
        const todos=await Todo.find({userID:id});
        res.status(200).json({
            status:"success",
            total_todos:todos.length,
            data:{
                todos
            }
        })
    }catch(err){
        res.status(400).json({
            status:"failed",
            message: err.message
        })
    }
    
}

exports.updateSingleTodo=async (req,res)=>{
    try{
        const {id}=req.params;
        const updatedTodo=await Todo.findByIdAndUpdate(id,{
            title:req.body.title,
            color:req.body.color
        },{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            status:"success",
            data:{
                todo:updatedTodo
            }
        })
    }catch(err){
        res.status(400).json({
            status:"failed",
            message: err.message
        })
    }
}

exports.deleteSingleTodo=async(req,res)=>{
    try{
        const {id}=req.params;
        await Todo.findByIdAndDelete(id);
        res.status(204).json({
            status:"success",
            data:{
                message:"Todo deleted successfully"
            }
        })
    }catch(err){
        res.status(400).json({
            status:"failed",
            message: err.message
        })
    }
}

exports.deleteAllTodos=async(req,res)=>{
    try{
        await Todo.deleteMany();
        res.status(204).json({
            status:"success",
            data:{
                message:"Todos deleted successfully"
            }
        })
    }catch(err){
        res.status(400).json({
            status:"failed",
            message: err.message
        })
    }
}

exports.deleteTask=async(req,res)=>{
    try{
        console.log(req.body.taskID)
        await Todo.findByIdAndUpdate(req.params.id,{
            $pull:{
                tasks:{_id:req.body.taskID}
            }
        });
        const todo=await Todo.findById(req.params.id);

        res.status(200).json({
            todo
        })
    }catch(err){
        res.status(400).json({
            status:"failed",
            message: err.message
        })
    }
}



exports.updateTask=async(req,res)=>{
    try{
        const todo=await Todo.findOne({_id:req.params.id});
        const taskToBeUpdated=todo.tasks.filter((task)=>task.id===req.body.taskID);
        taskToBeUpdated[0].title=req.body.newTitle;
        await todo.save()
        res.status(200).json({
            todo
        })
        
    }catch(err){
        res.status(400).json({
            status:"failed",
            message: err.message
        })
    }
}