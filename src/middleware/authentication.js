const jwt = require("jsonwebtoken")
const User = require("../models/users")


const authenticate = async (req, res, next)=>{
    try{
        //res.send(req.header("Authorization"))
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, "supercrazymonkey")
        console.log(decoded)
        const user = await User.findOne({"_id": decoded._id, "tokens.token": token})
        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    }
    catch(e){
        console.log(e)
        res.status(401).send("Bad authentication")


    }
}

module.exports = authenticate