let express         = require("express");
let router          = express.Router();
let {isLoggedIn, checkCampgroundOwnership}   = require("../middleware/middleware");
require('dotenv').config()
let campgroundController = require("../controllers/campgroundController");
let CampgroundModel = require("../Models/campgroundModel");


// Show Campground: First Page
router.get('/', campgroundController.getCampground);

// Show New: Create Campground Page
router.get('/new', isLoggedIn, campgroundController.getNewCampground)

// Post New: Send data to mongoDB
router.post("/", isLoggedIn, campgroundController.uploadSingleImage, campgroundController.postImageUpload)

// Show show: Show detail Campground
router.get('/:id', (request, response) => {
    CampgroundModel.findById(request.params.id).populate("comments").exec((error, foundIdCampground) => {
        if (error || !foundIdCampground) {
            console.log("get /:id error: " + error);
            response.redirect("/campgrounds")
        }
        else {
            response.render("../views/screens/iddetails", {foundCampground: foundIdCampground})
        }
    })
})

// Show Edit: 
router.get('/:id/edit', checkCampgroundOwnership, campgroundController.getEditCampgroundForm)

// PUT ID:
router.put("/:id", checkCampgroundOwnership, campgroundController.uploadSingleImage, campgroundController.putCampground)

// DELETE
router.delete("/:id", checkCampgroundOwnership, campgroundController.deleteCampground)

module.exports = router;