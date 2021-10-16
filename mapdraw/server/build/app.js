const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/tripsapp";
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("mongoose connection to db open");
});
var passport = require('passport');
// Passport configuration
const passportConfig = require("./config/passport");
var session = require("express-session"), cookieParser = require("cookie-parser");
app.use(express.json());
app.use('/', express.static('../client'));
app.use(session({ secret: "supeRRRsecret", resave: true, saveUninitialized: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
const userController = require('./controllers/UserController');
/**
 * User app routes.
 */
app.post("/user/signup", userController.postSignup);
app.post("/user/login", userController.postLogin);
app.get("/user/logout", userController.logout);
app.get("/user/isloggedin", userController.isloggedin); // isloggedin (req, res) => {console.log(req)},
app.post("/user/forgot", userController.postForgot);
app.post("/user/reset/:token", userController.postReset);
// app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
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
    //console.log( 'session: ' , req.session)
    mongo.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.error(err);
            return;
        }
        let object = req.params.object;
        //TODO: validate object is in objects
        const objects = ['trips', 'kitlists', 'routes', 'vehicles', 'sites'];
        const db = client.db('tripsapp');
        const collection = db.collection(object);
        let query = {};
        //console.log( 'session2: ' , req.session)
        if (req.session.passport != undefined) {
            console.log('get for logged in user');
            query = { user: req.session.passport.user };
        }
        else {
            console.log('get where no user exists ');
            query = { session: req.sessionID };
            query = { "user": { "$exists": false } };
        }
        collection.find(query).toArray((err, items) => {
            res.send(items);
        });
    });
});
app.post('/api/:object/', (req, res) => {
    console.log('Got a POST request');
    console.log('body is ', req.body);
    mongo.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.error(err);
            return;
        }
        const db = client.db('tripsapp');
        const collection = db.collection(req.params.object);
        let body = req.body;
        body.session = req.sessionID; // // insert user id / session id
        console.log(req.sessionID);
        if (body._id == null) {
            body._id = new ObjectID();
            collection.insertOne(body, (err, result) => {
                if (err == null) {
                    console.log('Returning from Insert', result.ops);
                    res.send(result.ops[0]);
                }
                else {
                    //TODO check this for security
                    res.send(err);
                    console.log('error: ', err);
                }
            });
        }
        else {
            const id = new ObjectID(body._id);
            let update = Object.assign({}, body);
            delete update._id;
            collection.updateOne({ _id: id }, { $set: update }, (err, result) => {
                if (err == null) {
                    console.log(" Returning from Update: ", body);
                    res.send(body);
                }
                else {
                    //TODO check this for security
                    res.send(err);
                    console.log('error: ', err);
                }
            });
        }
    });
});
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
//# sourceMappingURL=app.js.map