const mg = require("mongoose")

const Task = mg.model("Task", {
    name: {
        type: String,
        required: true,
        trim: true,

    },
    completed: {
        type: Boolean,
        default: false
    },
    author: {
        type: mg.Schema.Types.ObjectId,
        required: true,
        ref: "User"

    }
})

module.exports = Task