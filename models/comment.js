
var mongoose = require("mongoose");
 
var FeedMeCommentSchema = new mongoose.Schema({
	createdAt: {
	   type: Date,
	   default: Date.now
   	},
    text: String,
    author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "FeedMeUser"
		},
		username: String
	},

	rating: {
        type: Number,
        default: 0
    },
   restaurant: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "FeedMeRestaurant"
      }
   ]
});
 
module.exports = mongoose.model("FeedMeComment", FeedMeCommentSchema);