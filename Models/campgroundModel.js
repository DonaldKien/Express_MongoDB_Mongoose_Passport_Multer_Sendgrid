let mongoose    = require("mongoose");

let CampgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    imageId: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommentCollection"
        }
    ],
    author: {
        id: {type: mongoose.Schema.Types.ObjectId, ref: "UserCollection"},
        username: String
    }
})

let CampgroundModel = mongoose.model("CampgroundCollections", CampgroundSchema)

module.exports = CampgroundModel;