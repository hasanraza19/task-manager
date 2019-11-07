const mg = require("mongoose")
const url = "mongodb://127.0.0.1:27017/taskapi";
// const validator = require("validator")

mg.connect(url, {
    useNewUrlParser: "true",
    useCreateIndex: "true"
    
})




// const newuser = new User({
//     name: ".   Groovy    ",
//     age: 21,
//     email: "groovy@gmail.com",
//     password: "             passd"
// })

// newuser.save().then(()=>{

//     console.log(newuser)

// }).catch((error)=> {
//     console.log("Error: " +error)
// })


// const Task = mg.model("Task", {
//     name: {
//         type: String,
//         required: true,
//         trim: true,

//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })


// const aTask = new Task({
//     name: "   fsdfs",
//     completed: true
// })

// aTask.save().then(()=>{
//     console.log(aTask)
// }).catch((error)=> {
//     console.log("error: " +error)
// })