let CampgroundModel = require("../Models/campgroundModel");
let multer          = require("multer");
var cloudinary      = require('cloudinary').v2;
require('dotenv').config()

exports.getCampground = (request, response) => {
    CampgroundModel.find({}, (error, foundAllCampground) => {
        if (error || !foundAllCampground) {
            console.log("get /campground error: " + error);
        }
        else {
            response.render("../views/screens/campgrounds", {allCampground: foundAllCampground})
        }
    })
}

exports.getNewCampground = (request, response) => {
    response.render('./screens/new')
}

// UPLOAD IMAGE
let storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    }
});
let imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error ('Only image files are allowed!'), false);
    }
    cb(null, true);
}
cloudinary.config({
    cloud_name: 'dwhk',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
exports.uploadSingleImage = multer({storage: storage, fileFilter: imageFilter}).single('image')

exports.postImageUpload = function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(error, result) {
        // add cloudinary url for the image to the campground object under image property
        if (error || !result) {
            req.flash("error", "Unable to upload image");
            req.redirect("back");
        }
        else {
            req.body.campground.image = result.secure_url;
            req.body.campground.imageId = result.public_id;
            // add author to campground
            req.body.campground.author = {
              id: req.user._id,
              username: req.user.username
            }
        }
        CampgroundModel.create(req.body.campground, function(err, campground) {
          if (err || !campground) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          res.redirect('/campgrounds/' + campground.id);
        });
    });
}

exports.getIDCampground = (request, response) => {
    CampgroundModel.findById(request.params.id).populate("comments").exec((error, foundIdCampground) => {
        if (error || !foundIdCampground) {
            console.log("get /:id error: " + error);
            response.redirect("/campgrounds")
        }
        else {
            response.render("../views/screens/idshow", {foundCampground: foundIdCampground})
        }
    })
}

exports.getEditCampgroundForm = (request, response) => {
    CampgroundModel.findById(request.params.id, (error, foundIdCampground) => {
        if (error || !foundIdCampground) {
            console.log("get /:id/edit error: " + error);
            response.redirect("/campgrounds/" + request.params.id + "/edit");
        }
        else {
            response.render("../views/screens/edit", {foundCampground: foundIdCampground})
        }
    })
}

exports.putCampground = (request, response) => {
    CampgroundModel.findById( request.params.id, async (error, editedCampground) => {
        if (error || !editedCampground) {
            console.log("put /:id error: " + error);
            response.redirect("back")
        }else {
            if (request.file) {
                try {
                    await cloudinary.uploader.destroy(editedCampground.imageId, (error) => {
                        console.log("await destroy error: " + error)
                    });
                    await cloudinary.uploader.upload(request.file.path, (error, result) => {
                        if (error) {
                            console.log("await upload error: " + error)
                        }
                        else {
                            editedCampground.imageId = result.public_id;
                            editedCampground.image = result.secure_url;
                        }
                    })
                }
                catch (err) {
                    request.flash("error", err.message);
                    response.redirect("back");
                }
            }
            editedCampground.name = request.body.campground.name;
            editedCampground.price = request.body.campground.price;
            editedCampground.description = request.body.campground.description;
            editedCampground.save();
            request.flash("success", "Successfully updated");
            response.redirect("/campgrounds/" + editedCampground._id);         
        }
    })
}

exports.deleteCampground = (request, response) => {
    CampgroundModel.findById(request.params.id, (error, foundIdCampground) => {
        if (error) {
            console.log("delete /:id error: " + error)
        }
        else {  
            try {          
                cloudinary.uploader.destroy(foundIdCampground.imageId);
                foundIdCampground.remove();
                response.redirect("/campgrounds");
            }
            catch (error){
                console.log("delete /:id error: " + error);
                response.redirect("back");
            }
        }
    })
}