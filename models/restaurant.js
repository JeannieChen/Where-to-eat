var mongoose = require("mongoose");
 
var FeedMeRestaurantSchema = new mongoose.Schema({
   createdAt: {
	   type: Date,
	   default: Date.now
   },
   name: String,
   price: String,
   image: String,
   link: String,
   city: String,
   state: String,
   country: String,
   description: String,
   author: {
	   id: {
		   type: mongoose.Schema.Types.ObjectId,
		   ref: "FeedMeUser"
	   },
	   username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "FeedMeComment"
      }
   ],
	
   likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FeedMeUser"
        }
    ]
});
module.exports = mongoose.model("FeedMeRestaurant", FeedMeRestaurantSchema);
