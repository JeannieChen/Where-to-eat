var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware/index.js");
var func = require("../middleware/function.js");

// INDEX
router.get("/restaurant", function(req, res){
	// Search for restaurant
	if(req.query.search){
		const regex = new RegExp(func.escapeRegex(req.query.search), 'gi');
		Restaurant.find({name: regex}, function(err, allrestaurants){
			if(err){
				req.flash("error", "Oops! Something went wrong.");
				console.log(err);
			} else{
				res.render("restaurant/index", {
					restaurants:  allrestaurants,
					currentUser: req.user
				});
			}
		})
	// If nothing in Search, show all restaurants
	}else{
		Restaurant.find({}, function(err, allrestaurants){
			if(err){
				req.flash("error", "Oops! Something went wrong.");
				console.log(err);
			} else{
				res.render("restaurant/index", {
					restaurants:  allrestaurants,
					currentUser: req.user
				});
			}
		})
	}
});

// NEW
router.get("/restaurant/new", middleware.isLoggedIn, function(req, res){
	res.render("restaurant/new");
});


// CREATE
router.post("/restaurant", middleware.isLoggedIn , function(req,res){
	var name = req.body.name;
	var city = req.body.city;
	var state = req.body.state;
	var country = req.body.country;
	var price = req.body.price;
	var link = req.body.link;
	var image = req.body.image;
	var desc = req.body.description;

	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newRestaurant = {
		name: name, 
		city: city,
		state: state,
		country: country,
		price: price, 
		link: link, 
		image: image, 
		description: desc, 
		author: author};
	
	// Create a new restaurant and save to DB 	
	Restaurant.create(newRestaurant, function(err, newRestaurant){
			if(err){
				req.flash("error", "Oops! Something went wrong.");
				console.log(err);
			}else{
				// Redirect to restaurant 	
				req.flash("success", "Restaurant added.");
				res.redirect("/restaurant");
			}
		}
	)
});


// SHOW
router.get("/restaurant/:id", function(req, res){
	Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRest){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			console.log(err);
		}else{
			res.render("restaurant/show", {restaurant: foundRest});
		}
	});
});

// EDIT 
router.get("/restaurant/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Restaurant.findById(req.params.id, function(err, foundRest){
		res.render("restaurant/edit", {restaurant: foundRest});	
	})	
});

// UPDATE
router.put("/restaurant/:id", middleware.checkCampgroundOwnership, function(req, res){
	Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			res.redirect("/restaurant");
		}else{
			res.redirect("/restaurant/" + req.params.id)
		}
	})
});


// DESTROY
router.delete("/restaurant/:id", middleware.checkCampgroundOwnership, function(req, res){
	Restaurant.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			res.redirect("/restaurant");
		}else{
			req.flash("success", "Restaurant deleted.");
			res.redirect("/restaurant");
		}
	})
});


module.exports = router;