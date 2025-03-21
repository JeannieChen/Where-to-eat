var express  = require("express"),
	app = express(),
	bodyparser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	flash = require("connect-flash"),
	localStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	methodOverride = require("method-override"),
	
	User = require("./models/user"),
	Restaurant = require("./models/restaurant"),
	Comment = require("./models/comment");

var commentRoutes = require("./routes/comments"),
	restaurantRoutes = require("./routes/restaurants"),
	likeRoutes = require("./routes/like"),
	indexRoutes = require("./routes/index");

// Connect to DB 
// seedDB(); // Seed the database
// COPY: mongodb, view engine setup
// orig: mongodb+srv://JeannieChen:[pwd]@cluster0-ybpsb.mongodb.net/<dbname>?retryWrites=true&w=majority
//mongodb+srv://jeanniechen:JmzkBAfkJQ9NlNLN@cluster0.fflxs.mongodb.net/
mongoose.connect("mongodb+srv://jeanniechen:JmzkBAfkJQ9NlNLN@cluster0.fflxs.mongodb.net/", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Connected to DB.");
}).catch(err => {
	console.log('ERROR: ', err.message)
});

// JSON Parser & view engine setup, override, use flash, moment 
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

// Set up stylesheet
app.use(express.static(__dirname + "/public"));

// Passport Config
app.use(require("express-session")({
	secret: "blablabla",
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Set up routes
app.use(indexRoutes);
app.use(restaurantRoutes);
app.use(commentRoutes);
app.use(likeRoutes);


// listener
// app.listen(3000, function(){
// 	console.log("YelpCamp Server listening on port 3000.");
// });
const host = '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, function() {
  console.log("Server started.......");
});

