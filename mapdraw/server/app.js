"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var mongoose = require("mongoose");
var url = "mongodb://localhost:27017/mapdraw";
var userController = require('./controllers/UserController');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }); //useCreateIndex: true,
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("mongoose connection to db open");
});
var passport = require('passport');
var passportConfig = require("./config/passport");
var session = require("express-session"), cookieParser = require("cookie-parser");
app.use(express.json());
app.use('/', express.static('../client'));
app.use(session({ secret: "supeRRRsecret", resave: true, saveUninitialized: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
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
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), function (req, res) {
    res.redirect(req.session.returnTo || "/");
});
app.get('/api/:object/', function (req, res) {
    //console.log('params: ', req.params);
    //console.log( 'session: ' , req.session)
    mongo.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.error(err);
            return;
        }
        var object = req.params.object;
        //TODO: validate object is in objects
        var objects = ['trips', 'kitlists', 'routes', 'vehicles', 'sites'];
        var db = client.db('mapdraw');
        var collection = db.collection(object);
        var query = {};
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
        collection.find(query).toArray(function (err, items) {
            res.send(items);
        });
    });
});
app.post('/api/:object/', function (req, res) {
    console.log('Got a POST request');
    console.log('body is ', req.body);
    mongo.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.error(err);
            return;
        }
        var db = client.db('mapdraw');
        var collection = db.collection(req.params.object);
        var body = req.body;
        body.session = req.sessionID; // insert user id / session id
        console.log(req.sessionID);
        if (body._id == null) {
            body._id = new ObjectID();
            collection.insertOne(body, function (err, result) {
                if (err == null) {
                    console.log('Returning from Insert', result.ops);
                    res.send(result.ops);
                }
                else {
                    //TODO check this for security
                    res.send(err);
                    console.log('error: ', err);
                }
            });
        }
        else {
            var id = new ObjectID(body._id);
            var update = __assign({}, body);
            delete update._id;
            collection.updateOne({ _id: id }, { $set: update }, function (err, result) {
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
// 		const db = client.db('mapdraw')
// 		const collection = db.collection(req.params.object)
// 		collection.deleteOne({name: 'Togo'}, (err, item) => {
// 			console.log(item)
// 		})
// 	})
//  	res.send('Got a DELETE request')
// })
// module.exports = app;
var port = 3000;
app.use('*', express.static('../client/404.html'));
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port, "!"));
});
