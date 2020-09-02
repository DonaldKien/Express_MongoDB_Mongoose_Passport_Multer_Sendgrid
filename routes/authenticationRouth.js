require('dotenv').config();
let express     = require("express");
let router      = express.Router();
let passport    = require("passport");
let { isNotVerified }= require("../middleware/middleware")
const authenticationController = require("../controllers/authenticationController");

router.get("/", authenticationController.getLandingPage)
router.get("/register", authenticationController.getRegisterForm)
router.post("/register", authenticationController.postRegisterForm)
router.get('/verify-email', authenticationController.getVerifyEmail)

// LOGIN PAGE
router.get("/login", authenticationController.getLoginForm)

// LOGIN POST
router.post("/login", isNotVerified, passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login"}), (request, response) => {
})

// LOGOUT
router.get("/logout", authenticationController.getLogout)

// SendGrid API
router.get('/contact', authenticationController.getContactForm)

// POST /Contact
router.post('/contact', authenticationController.postContactForm)

module.exports = router;