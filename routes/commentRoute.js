let express         = require("express");
let router          = express.Router({mergeParams:true});
let {isLoggedIn, checkCommentOwnership}   = require("../middleware/middleware");
let commentController = require("../controllers/commentController")

// Open Comment Form
router.get("/new", isLoggedIn, commentController.getNewCommentForm)

// POST Comment
router.post("/", isLoggedIn, commentController.postNewCommentForm)

// Edit Comment
router.get("/:commentID/edit", checkCommentOwnership, commentController.getEditCommentForm)

// POST Edit Comment
router.put("/:commentID", checkCommentOwnership, commentController.putEditComment)

// Delete Comment
router.delete("/:commentID", checkCommentOwnership, commentController.deleteComment)

module.exports = router;