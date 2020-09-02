require('dotenv').config();
let express         = require("express");
let app             = express();
let campgroundRoute = require("./routes/campgroundRoute");
let commentRoute    = require("./routes/commentRoute")
let mongoose        = require("mongoose");
let bodyParser      = require("body-parser");
let methodOverride  = require("method-override");
let authenticationRoute = require("./routes/authenticationRouth");
let passport        = require("passport");
let passportLocal   = require("passport-local");
let userModel       = require("./Models/userModel");
let connectFlash	= require("connect-flash");
let expressSanitizer= require('express-sanitizer');

mongoose.connect(process.env.MONGODB_API_KEY, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
})

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))
app.use(express.json());
app.use(expressSanitizer());
app.use(require("express-session")({
	secret: "this sentence use to encode and decode data",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use(connectFlash());

app.use((request, response, next) => {
	response.locals.currentUser = request.user;
	response.locals.error = request.flash("error");
	response.locals.success = request.flash("success");
	next();
})

// Routes
app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/comments', commentRoute);
app.use('/', authenticationRoute);

app.listen( process.env.PORT || 3000, () => {
    console.log("connected to server")
})