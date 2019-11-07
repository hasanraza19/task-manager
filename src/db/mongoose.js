const mg = require("mongoose")
const url = "mongodb://127.0.0.1:27017/taskapi";


mg.connect(url, {
    useNewUrlParser: "true",
    useCreateIndex: "true"
    
})



