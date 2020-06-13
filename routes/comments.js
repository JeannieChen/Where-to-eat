
var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant"),
	Comment = require("../models/comment");
var middleware = require("../middleware/index.js");


// NEW
router.get("/restaurant/:id/comments/new", middleware.isLoggedIn, function(req, res){
	Restaurant.findById(req.params.id, function(err, foundRestaurant){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
		}else{
			res.render("comments/new", {restaurant: foundRestaurant});
		}
	});
});

// CREATE
router.post("/restaurant/:id/comments", middleware.isLoggedIn, function(req, res){
	Restaurant.findById(req.params.id, function(err, restaurant){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			res.redirect("/restaurant");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Oops! Something went wrong.");
					console.log(err);
				} else{
 					// Add usernamd & id to comment, save comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					
					restaurant.comments.push(comment);
					restaurant.save();
					
					req.flash("success", "Comment added!");
					res.redirect("/restaurant/" + restaurant._id);
				}
			})
		}
	})
});

// EDIT
router.get("/restaurant/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			res.redirect("back");
		}else{
			res.render("comments/edit", {
			restaurant_id: req.params.id,
			comment: foundComment
			});				
		}
	})
});

// UPDATE
router.put("/restaurant/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			res.redirect("back");
		}else{
			res.redirect("/restaurant/" + req.params.id);
		}
	})
});

// DESTROY
router.delete("/restaurant/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			res.redirect("back");
		}else{
			req.flash("success", "Comment deleted.");
			res.redirect("/restaurant/"+ req.params.id);
		}
	})
});
			

module.exports = router;