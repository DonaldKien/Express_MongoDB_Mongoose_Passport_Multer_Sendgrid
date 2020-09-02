let mongoose    = require("mongoose");


let userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    emailToken: String,
    isVerified: Boolean,
    isPaid: { type: Boolean, default: false }
})

userSchema.plugin(require("passport-local-mongoose"))

let UserModel = mongoose.model("UserCollection", userSchema)

module.exports = UserModel;