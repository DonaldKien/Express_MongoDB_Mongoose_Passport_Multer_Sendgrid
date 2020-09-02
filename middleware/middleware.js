let CampgroundModel = require("../Models/campgroundModel");
let CommentModel 	= require("../Models/commentModel");
let User        	= require("../Models/userModel");
let middlewareObj = {};

middlewareObj.isLoggedIn = (request, response, next) => {
	if (request.isAuthenticated()) {
		return next();
	} else {
		request.flash("error", "Please Log in, Thank you");
		response.redirect("/login");
	}
}

middlewareObj.checkCampgroundOwnership = (request, response, next) => {
	if (request.isAuthenticated()){
		CampgroundModel.findById(request.params.id, (error, foundIdCampground) => {
			if (error || !foundIdCampground) {
				console.log("error");
				response.redirect("back");
			}
			else {
				if (foundIdCampground.author.id.equals(request.user._id)) {
					next()
				}
				else{
					response.redirect("back");
				}
			}
		})
	}
	else {
		response.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = (request, response, next) => {
	if (request.isAuthenticated()) {
		CampgroundModel.findById(request.params.id, (error, foundIdCampground) => {
			if (error || !foundIdCampground) {
				console.log("checkCommentOwnership_CampgroundModel_error: " + error);
				response.redirect("/campgrounds");
			}
			else {
				CommentModel.findById(request.params.commentID, (error, foundIdComment) => {
					if (error || !foundIdComment){
						console.log("checkCommentOwnership error: " + error)
						response.redirect("/campgrounds");
					}
					else {
						if (foundIdComment.author.id.equals(request.user._id)) {
							next()
						}
						else {
							response.redirect("back");
						}
					}
				})
			}
		})
	}
	else {
		response.redirect("back");
	}
}

middlewareObj.isNotVerified = async (req, res, next) => {
	try {
		const user = await User.findOne( {username: req.body.username} );
		if (user.isVerified){
			return next()
		}
		req.flash("error", "Please check your email to verify your account")
		return res.redirect('/');
	} 
	catch (error) {
		console.log("middlewareObj.isNotVerified error: " + error);
		req.flash("error", "Something went wrong. Please contact us for assistancce");
		res.redirect("/");
	}
}

middlewareObj.isPaid = (req, res, next) => {
	User.findById(req.user._id, (error, foundUserId) => {
		if (error) {
			console.log("midlewareObj.isPaid error: " + error)
		}
		else {
			if (foundUserId.isPaid){
				console.log(foundUserId)
				return next()
			}
			req.flash("error", "Please provide payment to proceed");
			return res.redirect('/payment');
		}
	})
}

module.exports = middlewareObj;