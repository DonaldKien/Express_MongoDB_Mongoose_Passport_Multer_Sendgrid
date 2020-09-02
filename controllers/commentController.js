let CampgroundModel = require("../Models/campgroundModel");
let CommentModel    = require("../Models/commentModel");


exports.getNewCommentForm = (request, response) => {
    CampgroundModel.findById(request.params.id, (error, foundIdCampground) => {
        if (error || !foundIdCampground) {
            console.log("get /campgrounds/:id/comments/new error: " + error);
            response.redirect("/campgrounds/" + request.params.id)
        } 
        else {
            response.render("../views/screens/newComment", {foundCampground: foundIdCampground})
        }
    })
}

exports.postNewCommentForm = (request, response) => {
    CampgroundModel.findById(request.params.id, (error, foundIdCampground) => {
        if (error || !foundIdCampground) {
            console.log("post /campgrounds/:id/comments error: " + error);
            response.redirect("/campgrounds/" + request.params.id)
        } 
        else {
            CommentModel.create(request.body.comment, (error, newComment) => {
                if (error || !newComment) {
                    console.log("CommentModel-post-/campgrounds/:id/comments/-" + error )
                    response.redirect("back")
                }
                else {
                    newComment.author.id = request.user._id;
                    newComment.author.username = request.user.username;
                    newComment.save();
                    foundIdCampground.comments.push(newComment);
                    foundIdCampground.save();
                    response.redirect("/campgrounds/" + foundIdCampground._id)
                }
            })
        }
    })
}

exports.getEditCommentForm = (request, response) => {
    CampgroundModel.findById(request.params.id, (error, foundIdCampground) => {
        if (error || !foundIdCampground) {
            console.log("get_/campground/:id/comments/:commentID/edit_error: " + error);
            return response.redirect("/campgrounds");
        }
    })
    CommentModel.findById(request.params.commentID, (error, foundCommentId) => {
        if (error || !foundCommentId) {
            console.log("get /:commentID/edit error: " + error);
            return response.redirect("back");
        } 
        else {
            response.render("../views/screens/editComment", {campground_id: request.params.id, foundComment: foundCommentId})
        }
    })
}

exports.putEditComment = (request, response) => {
    CampgroundModel.findById(request.params.id, (error, foundIdCampground) => {
        if (error || !foundIdCampground){
            console.log("put_/campground/:id/comments/:commentID_error: " + error )
            return response.redirect("back");
        }
    })
    CommentModel.findByIdAndUpdate(request.params.commentID, request.body.comment , (error, foundIdComment) => {
        if (error || !foundIdComment) {
            console.log("put_/campground/:id/comments/:commentID_error: " + error);
            response.redirect("back");
        }
        else {
            response.redirect("/campgrounds/" + request.params.id)
        }
    })
}

exports.deleteComment = (request, response) => {
    CommentModel.findByIdAndDelete(request.params.commentID, (error) => {
        if (error) {
            console.log("delete_/campground/:id/comments/:commentID_error: " + error)
        }
        else {
            response.redirect("/campgrounds/" + request.params.id)
        }
    })
}