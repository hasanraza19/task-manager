const express = require("express")
const User = require("../models/users")
const authenticate = require("../middleware/authentication")
const router = new express.Router()

router.post("/users", async (req, res) => {
    const newUser = new User(req.body)
    try {
        await newUser.save()
        const token = await newUser.generateJWT()
        res.status(201).send({newUser, token})
    }
    catch (e) {
        console.log(e)
        res.status(400)
        res.send(e)
    }
})



router.post("/users/login", async (req, res)=>{

    try{

        const user = await User.findByCreds(req.body.email, req.body.password)
        const token = await user.generateJWT()
        res.send({user, token})
    }
    catch(e){
        res.status(400).send(e)
    }
    


})



router.post("/users/logout", authenticate, async(req,res)=>{
    try{

        req.user.tokens = req.user.tokens.filter((token)=>token.token !== req.token)
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()



    }


})


router.post("/users/logoutAll", authenticate, async (req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()

    }
    catch(e){
        res.status(500).send()
    }




})




router.get("/users/me", authenticate, async (req, res) => {

    res.status(200).send(req.user)

})




router.patch("/users/me", authenticate, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "age", "email", "password"]
    const safe = updates.every((update)=>allowedUpdates.includes(update))
    if(!safe){
        return res.send({"error": "At least one key provided is an invalid entry."})
    }

    try{
        //const user = await User.findById(req.user._id)
        updates.forEach((update)=> req.user[update] = req.body[update])
        await req.user.save()

        //const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true})
        // if(!user){
        //     return res.status(404).send()
        // }
        res.send(req.user)

    }catch(e){

        res.status(500).send(e)

    }



})



router.delete("/users/me", authenticate, async (req, res)=>{

    try{
        // const deleted = await User.findByIdAndDelete(req.params.id)
        // if(!deleted){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        res.send(req.user)

    }catch(e){

        res.status(400).send(e)


    }
    



})


module.exports = router