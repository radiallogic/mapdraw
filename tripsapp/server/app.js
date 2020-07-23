
const express = require('express')
const app = express()
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
import mongostore from "connect-mongo";



const MongoStore = mongostore(session);
const url = "mongodb://localhost:27017/tripsapp"; // tripsapp 

mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
    console.log("mongoose connection to db open")
});


app.use(express.json());
app.use('/', express.static('../client'));
//app.use(compression());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'AsuperSecrettTT!!!StRinGGG',
    store: new MongoStore({
        url: url,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
import * as passportConfig from "./config/passport";

const userController = require('./controllers/UserController');
/**
 * User app routes.
 */
app.post("/user/signup", userController.postSignup);
app.post("/user/login", userController.postLogin);
app.get("/user/logout", userController.logout);
app.get("/user/isloggedin", userController.isloggedin);
app.post("/user/forgot", userController.postForgot);
app.post("/user/reset/:token", userController.postReset);

// app.get("/contact", contactController.getContact);
// app.post("/contact", contactController.postContact);

// app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
// app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
// app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
// app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
// app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
//app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, userController.getFacebook);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
    res.redirect(req.session.returnTo || "/");
});



app.get('/api/:object/', (req, res) => {
	//console.log('params: ', req.params);

	console.log( 'session: ' , req.session)

	mongo.connect(url, { useNewUrlParser: true }, (err, client) => {
		if (err) {
			console.error(err);
			return 
		}

		let object = req.params.object;
		//TODO: validate object is in objects
		const objects = ['trips', 'kitlists', 'routes', 'vehicles', 'sites']; 

		const db = client.db('tripsapp')
		const collection = db.collection(object)

		let query = {};
		if( req.session.passport != undefined){ 
			console.log('get for logged in user');
		    query = {user: req.session.passport.user};
		}else{
			console.log('get where no user exists ');
			query = {session: req.sessionID};
			query = { "user" : { "$exists" : false }}
		}
		
		collection.find(query).toArray((err, items) => {
			res.send(items);
		})
	})
})

app.post('/api/:object/', (req, res) => { // data/data:

	console.log('Got a POST request'); 
	console.log('body is ', req.body);
	
	mongo.connect(url, { useNewUrlParser: true }, (err, client) => {
		if (err) {
			console.error(err);
			return 
		}
		const db = client.db('tripsapp')
		const collection = db.collection(req.params.object)

		let body = req.body;
		body.session = req.sessionID; // // insert user id / session id
		console.log(req.sessionID); 

		if(body._id == null){
			body._id = new ObjectID();
			collection.insertOne(body, (err, result) => {
				if(err == null){
					console.log('Returning from Insert', result.ops);
					res.send(result.ops[0])
				}else{
					//TODO check this for security
					res.send(err)
					console.log('error: ', err)
				}
			})
		}else{

			const id = new ObjectID(body._id);
			let update = {...body};
			delete update._id;
			
			collection.updateOne({_id: id },  { $set: update} , (err, result) => {
				if(err == null){
					console.log(" Returning from Update: ", body);
					res.send(body)
				}else{
					//TODO check this for security
					res.send(err)
					console.log('error: ', err)
				}
			})
		}

		
	})

	
})

// app.delete('/api/:object/:id', (req, res) => {

// 	mongo.connect(url, (err, client) => {
// 		if (err) {
// 			console.error(err);
// 			return 
// 		}
// 		const db = client.db('tripsapp')
// 		const collection = db.collection(req.params.object)

// 		collection.deleteOne({name: 'Togo'}, (err, item) => {
// 			console.log(item)
// 		})
// 	})
	
//  	res.send('Got a DELETE request')
// })

module.exports = app;