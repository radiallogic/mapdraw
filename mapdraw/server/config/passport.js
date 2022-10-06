"use strict";
exports.__esModule = true;
exports.isAuthorized = exports.isAuthenticated = void 0;
var passport_1 = require("passport");
var passport_local_1 = require("passport-local");
var passport_facebook_1 = require("passport-facebook");
//import passportToken from 'passport-jwt';
var lodash_1 = require("lodash");
var User_1 = require("../models/User");
var LocalStrategy = passport_local_1["default"].Strategy;
var FacebookStrategy = passport_facebook_1["default"].Strategy;
passport_1["default"].serializeUser(function (user, done) {
    console.log("serializeUser", done);
    console.log("done", user);
    done(null, user);
});
passport_1["default"].deserializeUser(function (id, done) {
    User_1.User.findById(id, function (err, user) {
        done(err, user);
    });
});
/**
 * Sign in using Email and Password.
 */
passport_1["default"].use(new LocalStrategy({ usernameField: "email" }, function (email, password, done) {
    console.log(' passport local ');
    User_1.User.findOne({ email: email.toLowerCase() }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(undefined, false, { message: "Email ".concat(email, " not found.") });
        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, { message: "Invalid email or password." });
        });
    });
}));
/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */
/**
 * Sign in with Facebook.
 */
passport_1["default"].use(new FacebookStrategy({
    clientID: '476634689759858',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["name", "email", "link", "locale", "timezone"],
    passReqToCallback: true
}, function (req, accessToken, refreshToken, profile, done) {
    if (req.user) {
        User_1.User.findOne({ facebook: profile.id }, function (err, existingUser) {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                req.flash("errors", { msg: "There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account." });
                done(err);
            }
            else {
                User_1.User.findById(req.user.id, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    user.facebook = profile.id;
                    user.tokens.push({ kind: "facebook", accessToken: accessToken });
                    user.profile.name = user.profile.name || "".concat(profile.name.givenName, " ").concat(profile.name.familyName);
                    user.profile.gender = user.profile.gender || profile._json.gender;
                    user.profile.picture = user.profile.picture || "https://graph.facebook.com/".concat(profile.id, "/picture?type=large");
                    user.save(function (err) {
                        req.flash("info", { msg: "Facebook account has been linked." });
                        done(err, user);
                    });
                });
            }
        });
    }
    else {
        User_1.User.findOne({ facebook: profile.id }, function (err, existingUser) {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                return done(undefined, existingUser);
            }
            User_1.User.findOne({ email: profile._json.email }, function (err, existingEmailUser) {
                if (err) {
                    return done(err);
                }
                if (existingEmailUser) {
                    req.flash("errors", { msg: "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings." });
                    done(err);
                }
                else {
                    var user_1 = new User_1.User();
                    user_1.email = profile._json.email;
                    user_1.facebook = profile.id;
                    user_1.tokens.push({ kind: "facebook", accessToken: accessToken });
                    user_1.profile.name = "".concat(profile.name.givenName, " ").concat(profile.name.familyName);
                    user_1.profile.gender = profile._json.gender;
                    user_1.profile.picture = "https://graph.facebook.com/".concat(profile.id, "/picture?type=large");
                    user_1.profile.location = (profile._json.location) ? profile._json.location.name : "";
                    user_1.save(function (err) {
                        done(err, user_1);
                    });
                }
            });
        });
    }
}));
/**
 * Login Required middleware.
 */
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};
exports.isAuthenticated = isAuthenticated;
/**
 * Authorization Required middleware.
 */
var isAuthorized = function (req, res, next) {
    var provider = req.path.split("/").slice(-1)[0];
    var user = req.user;
    if (lodash_1["default"].find(user.tokens, { kind: provider })) {
        next();
    }
    else {
        res.redirect("/auth/".concat(provider));
    }
};
exports.isAuthorized = isAuthorized;
