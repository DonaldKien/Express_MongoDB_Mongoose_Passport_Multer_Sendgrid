let mongoose       = require("mongoose");

let CommentSchema = new mongoose.Schema({
    text: String,
    date: {type:Date, default: Date.now()},
    author: {
        id: {type: mongoose.Schema.Types.ObjectId, ref: "UserCollection"},
        username: String
    }
})

let CommentModel = mongoose.model("CommentCollection", CommentSchema)

module.exports = CommentModel;