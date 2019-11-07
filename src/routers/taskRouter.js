const express = require("express")
const router = new express.Router()
const Task = require("../models/tasks")
const authenticate = require("../middleware/authentication")


router.post("/tasks", authenticate, async (req, res) => {
    const newTask = new Task({
        ...req.body,
        author: req.user._id


    })

    try{
        await newTask.save()
        res.status(201).send(newTask)

    }
    catch(e){
        res.send(e)
    }




    // newTask.save().then(() => {
    //     res.status(201).send(newTask)


    // }).catch((error) => {

    //     res.status(400).send(error)


    // })

})

router.get("/tasks", authenticate, async (req, res) => {

    try{

        const tasks = await Task.find({author: req.user._id})
        res.send(tasks)

    }catch(e){
        res.send(e)
    }

    // Task.find({}).then((users) => {
    //     res.send(users)


    // }).catch((e) => {
    //     res.send(e)

    // })



})

router.get("/tasks/:id", authenticate, async (req, res) => {
    const _id = req.params.id

    

    try{
        const task = await Task.findOne({_id, author: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)

    }catch(e){
        console.log(e)
        res.status(400).send(e)


    }







})


router.patch("/tasks/:id", authenticate, async (req, res) =>{
    const allowedUpdates = ["name", "completed"]
    const updates = Object.keys(req.body)
    const safe = updates.every((update)=>allowedUpdates.includes(update))
    if(!safe){
        return res.status(400).send({"error": "At least one update is invalid."})
    }



    try{
        const taskToUpdate = await Task.findOne({_id: req.params.id, author: req.user._id})
        //const taskToUpdate = await Task.findById(req.params.id)
        if(!taskToUpdate){
            return res.status(404).send()
        }
        updates.forEach((update)=>taskToUpdate[update] = req.body[update])
        await taskToUpdate.save()
        //const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        

        res.send(taskToUpdate)


    }catch(e){
        res.status(400).send(e)


    }




})

router.delete("/tasks/:id", authenticate, async (req, res)=>{
    try{
        const deleted = await Task.findOneAndDelete({_id: req.params.id, author: req.user._id})
        
        if(!deleted){
            return res.status(404).send()
        }
        res.send(deleted)



    }catch(e){

        res.status(500).send()



    }





})


module.exports = router