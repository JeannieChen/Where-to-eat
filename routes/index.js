var express = require("express");
var router = express.Router();
var passport = require("passport");
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var User = require("../models/user");
var middleware = require("../middleware/index.js");


// Landing page: root
router.get("/", function(req, res){	
	res.render("landing");
});

// ================ AUTH ROUTE =================
// Show register form
router.get("/register", function(req, res){
	res.render("register");
});
// Hangle sign up
router.post("/register", function(req, res){
	var newUser = new User({
		username: req.body.username,
		email: req.body.email
	});
	if(req.body.isAdmin === 'asdf'){
		newUser.isAdmin = true;
	};
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to FeedMe, " + user.username + "!");
			res.redirect("/restaurant");
		})
	})
});
// Show login form
router.get("/login", function(req, res){
	res.render("login");
});
// Handle login
router.post("/login", 
		 passport.authenticate("local",{
						successRedirect: "/restaurant",
						failureRedirect: "/login"
							}),
		 function(req, res){
});
// Log out
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You've logged out.");
	res.redirect("/restaurant");
});

// USER profile - SHOW
router.get("/users/:id", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{

		Restaurant.find().where('author.id').equals(foundUser._id).exec(function(err,restaurant){
				if(err){
					req.flash("error", err.message);
					res.redirect("back");
				}else{
			Comment.find().where('author.id').equals(foundUser._id).exec(function(err,comments){
					if(err){
						req.flash("error", err.message);
						res.redirect("back");
					}else{
						res.render("users/show", {
							user: foundUser,
							restaurant: restaurant,
							comments: comments
						});	
						}
				})
				}
		})
		}
	})
});


module.exports = router;

