"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/mapdraw";
const userController = require('./controllers/UserController');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }); //useCreateIndex: true,
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("mongoose connection to db open");
});
var passport = require('passport');
const passportConfig = __importStar(require("./config/passport"));
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
        const db = client.db('mapdraw');
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
        const db = client.db('mapdraw');
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
            let update = { ...body };
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
// 		const db = client.db('mapdraw')
// 		const collection = db.collection(req.params.object)
// 		collection.deleteOne({name: 'Togo'}, (err, item) => {
// 			console.log(item)
// 		})
// 	})
//  	res.send('Got a DELETE request')
// })
// module.exports = app;
const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
//# sourceMappingURL=app.js.map