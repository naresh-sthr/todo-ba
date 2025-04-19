import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Todo} from './models/Todo.schema.js';
const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;


mongoose.connect('mongodb+srv://nareshsuthardev:naresh@cluster0.nszkz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(console.log("Db Connected"))
.catch(err=>console.log("Error while connecting DB",err));

app.listen(PORT,console.log(`Server is running on http://localhost:${PORT}`));

app.get('/todos',async(req,res)=>{
    try {
        const todos = await Todo.find();
        res.status(201).json({todos});
    } catch (error) {
        res.status(400).json({Msg:`${error}`})
    }
});

app.post('/todos',async(req,res)=>{
    try {
        const {title,isCompleted} = req.body;
        const todo = new Todo({title,isCompleted});
        await todo.save();
        res.status(200).json({Msg: "Todo Created "})
    } catch (error) {
        res.status(400).json({Error: `${error}`});
    }
});

app.delete('/todos/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        await Todo.findByIdAndDelete(id);
        res.status(201).json({Msg:"Todo Deleted"});
    } catch (error) {
        res.status(400).json({Err: "Error"});
    }
})

app.put('/todos/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        const getTodo = await Todo.findOne({_id:id});
        if(getTodo.isCompleted == false){
            await Todo.findByIdAndUpdate(id,{isCompleted: true})
        }else{
            await Todo.findByIdAndUpdate(id,{isCompleted: false});
        }
        res.status(200).json({Msg:"Updated Successfully"});
    } catch (error) {
        res.status(400).json({Msg: `${error}`});
    }
})
