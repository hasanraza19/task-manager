const express = require("express")
const app = express()
const port = process.env.PORT || 3000
require("./db/mongoose.js")


const userRouter = require("./routers/userRouter")
const taskRouter = require("./routers/taskRouter")


app.use((req,res,next)=>{
        console.log(req.method, req.path)

    next()
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)







app.listen(port, () => {
    console.log("Server up on port: " + port)



})




