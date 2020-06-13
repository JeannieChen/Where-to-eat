var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant"),
	Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

// Like Route
router.post("/restaurant/:id/like", middleware.isLoggedIn, function (req, res) {
    Restaurant.findById(req.params.id, function (err, foundRestaurant) {
        if (err) {
            req.flash("error", "Oops! Something went wrong.");
            return res.redirect("back");
        }
		
        // check if req.user._id exists in foundRestaurant.likes
        var foundUserLike = foundRestaurant.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundRestaurant.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundRestaurant.likes.push(req.user);
        }

        foundRestaurant.save(function (err) {
            if (err) {
                req.flash("error", "Oops! Something went wrong.");
                return res.redirect("back");
            }
            return res.redirect("/restaurant/" + foundRestaurant._id);
        });
    });
});

module.exports = router;