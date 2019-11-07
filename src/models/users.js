const mg = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require("./tasks")



const userSchema = new mg.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            default: 1,
            validate(val) {
                if (val <= 0) {
                    throw new Error("Age must be greater than zero")
                }

            }
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(em) {
                if (!validator.isEmail(em))
                    throw new Error("invalid email")
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            validate(pass) {
                if (!validator.isLength(pass, 6) || validator.contains(pass.toLowerCase(), "password")) {
                    throw new Error("Bad password")


                }


            }



        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]

    }
)


userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "author"



})

userSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.tokens
    delete user.password
    return user


}

userSchema.methods.generateJWT = async function(){
    const token = jwt.sign({"_id": this._id.toString()}, "supercrazymonkey")
    this.tokens = this.tokens.concat({token})
    //this.tokens.push(token.toString()) 
    await this.save()
    return token
}


userSchema.statics.findByCreds = async (email, password)=>{
    const user = await User.findOne({email })
    if(!user){
        throw new Error("Bad login")
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw new Error("Bad login")
    }

    return user



}


userSchema.pre("save", async function (next)  {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 8)

    }
    

    console.log(this.password)




    next()
})

userSchema.pre("remove", async function(next){
    const user = this
    await Task.deleteMany({author: user._id})



    next()
})





const User = mg.model("User", userSchema)

module.exports = User