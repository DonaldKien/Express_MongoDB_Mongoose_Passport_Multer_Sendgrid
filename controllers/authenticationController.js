let User        = require("../Models/userModel");
let passport    = require("passport");
const sgMail    = require('@sendgrid/mail');
const crypto    = require('crypto');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.getLandingPage = (request, response) => {
    response.render("../views/screens/landing");
}

exports.getRegisterForm = (request, response) => {
    response.render("../views/screens/registration");
}

exports.postRegisterForm = async (request, response) => {
    let newUser = new User({
        username: request.body.username,
        email: request.body.email,
        emailToken: crypto.randomBytes(64).toString('hex'),
        isVerified: false
    })
    User.register(newUser, request.body.password, async (error, user) => {
        if (error) {
            console.log(error);
            request.flash("error", error.message);
            return response.redirect("back");
        }console.log("request.headers.host: " + request.headers.host);
        const msg = {
            from: 'donaldkien94@gmail.com',
            to: user.email,
            subject: "Campground - verify your email",
            text: `
                Hello, thanks for registering. 
                Please copy and paste the address below to verify your account.
                http://${request.headers.host}/verify-email?token=${user.emailToken}
            `,
            html: `
                <h1>Hello,</h1>
                <p>Please click the link below to verify your account.</p>
                <a href="${request.headers.host}/verify-email?token=${user.emailToken}">Click here to verify</a>
                <p>Or copy and paste the url below in new tab</p>
                <p>${request.headers.host}/verify-email?token=${user.emailToken}</p>
            `
        }
        try{
            await sgMail.send(msg);
            request.flash("success", "Please check your email to verify your account.");
            return response.redirect('/campgrounds');
        }
        catch (error) {
            console.log(error);
            request.flash("error", "Please contact us at abc@123.com");
            response.redirect("/");
        }
    })
}

exports.getVerifyEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({ emailToken: req.query.token });
        console.log("emailToken: " + req.query.token);
        console.log("user: " + user);
        if (!user) {
            req.flash("error", 'Token is invalid. Please contact us for assistance');
            return res.redirect('/')
        }
        user.emailToken = null;
        user.isVerified = true;
        await user.save();
        await req.login(user, async (err) => {
            passport.authenticate("local",{ failureRedirect: '/login' });
            req.flash("success", `Welcome to Campground, ${user.username}`);
            const redirectUrl = req.session.redirectTo || '/campgrounds';
            delete req.session.redirectTo;
            res.redirect(redirectUrl);
        })
    }
    catch (error) {
        console.log(error);
        req.flash("error", "Something went wrong. Please contact us for assistance");
        res.redirect('/');
    }
}

exports.getLoginForm = (request, response) => {
    response.render("../views/screens/login")
}

exports.getLogout = (request, response) => {
    request.flash("success", "Successfully Logout")
    request.logout();
    response.redirect("/campgrounds");
}

exports.getContactForm = (req, res) => {
    res.render('screens/contact')
}

exports.postContactForm = async(req, res) => {
    let { email, message } = req.body;
    email = req.sanitize(email);
    emailTo = "donaldkien94@gmail.com";
    message = req.sanitize(message);
    const msg = {
        to: emailTo,
        from: "donaldkien94@gmail.com", // Use the email address or domain you verified above
        subject: `Campground contact form from ${email}`,
        text: message,
        html: `<strong>${req.body.message}</strong>`,
    };
    try {
        await sgMail.send(msg);
        req.flash("success", "Thank you for your email, we will get back to you shortly");
        res.redirect('/contact')
    } 
    catch (error) {
        console.error(error);
        if (error.response) {
            console.error(error.response.body)
        }
        req.flash("error", "Sorry, something went wrong, please contact admin@email.com")
        res.redirect("back");
    }
}