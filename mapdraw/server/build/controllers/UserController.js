"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFacebook = exports.postForgot = exports.postReset = exports.getOauthUnlink = exports.postDeleteAccount = exports.postUpdatePassword = exports.postUpdateProfile = exports.postSignup = exports.logout = exports.postLogin = exports.isloggedin = void 0;
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const User_1 = require("../models/User");
const nodemailer_1 = __importDefault(require("nodemailer"));
require("../config/passport");
const crypto = require('crypto');
const async = require("async");
const fbgraph_1 = __importDefault(require("fbgraph"));
/**
 * GET /user/isloggedin
 * isloggedin
 */
const isloggedin = (req, res) => {
    console.log("isLoggedIn: ", req.session);
    if (req.session.passport ?? undefined) {
        res.status(200);
        return res.json({ user: req.session.passport.user.email });
    }
    else {
        res.status(200);
        return res.json({ user: null });
    }
};
exports.isloggedin = isloggedin;
/**
 * POST /login
 * Sign in using email and password.
 */
const postLogin = async (req, res, next) => {
    console.log('in post login');
    await (0, express_validator_1.check)("email", "Email is not valid").isEmail().run(req);
    await (0, express_validator_1.check)("password", "Password cannot be blank").isLength({ min: 1 }).run(req);
    await (0, express_validator_1.check)("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = (0, express_validator_1.validationResult)(req);
    console.log('errors: ', errors);
    if (!errors.isEmpty()) {
        return res.status(422).send(errors.array());
    }
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            res.status(404).json(err);
            return;
        }
        if (user) {
            //const token = user.generateJwt();
            req.login(user, (err) => {
                console.log("login user", user);
                console.log("err", err);
            });
            res.status(200);
            res.json({
                user: user,
                //token: token
            });
        }
        else {
            res.status(401).json(info);
        }
    })(req, res);
};
exports.postLogin = postLogin;
/**
 * GET /user/logout
 * Log out.
 */
const logout = (req, res) => {
    req.logout();
    return res.send({});
};
exports.logout = logout;
/**
 * POST /signup
 * Create a new local account.
 */
const postSignup = async (req, res, next) => {
    await (0, express_validator_1.check)("email", "Email is not valid").isEmail().run(req);
    await (0, express_validator_1.check)("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await (0, express_validator_1.check)("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422);
        return res.send(errors.array());
    }
    const user = new User_1.User({
        email: req.body.email,
        password: req.body.password
    });
    User_1.User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            return res.status(422).send([{ msg: "Account with that email address already exists." }]);
        }
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.logIn(user, (err) => {
                console.log('login after sign up', err);
                if (err) {
                    return next(err);
                }
            });
            return res.status(201).send([{ msg: "completed" }]);
        });
    });
};
exports.postSignup = postSignup;
/**
 * POST /account/profile
 * Update profile information.
 */
const postUpdateProfile = async (req, res, next) => {
    await (0, express_validator_1.check)("email", "Please enter a valid email address.").isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await (0, express_validator_1.sanitize)("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(403).send({ "errors": errors.array() });
    }
    const user = req.user;
    User_1.User.findById(user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user.email = req.body.email || "";
        user.save(() => {
            if (err) {
                if (err.code === 11000) {
                    return res.send({ "error": "The email address you have entered is already associated with an account." });
                }
                return next(err);
            }
            res.status(200).send({ msg: "Profile information has been updated." });
        });
    });
};
exports.postUpdateProfile = postUpdateProfile;
/**
 * POST /account/password
 * Update current password.
 */
const postUpdatePassword = async (req, res, next) => {
    await (0, express_validator_1.check)("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await (0, express_validator_1.check)("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.send({ "errors": errors.array() });
    }
    const user = req.user;
    User_1.User.findById(user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user.password = req.body.password;
        user.save(() => {
            if (err) {
                return next(err);
            }
            res.status(200).send({ msg: "Password has been changed." });
        });
    });
};
exports.postUpdatePassword = postUpdatePassword;
/**
 * POST /account/delete
 * Delete user account.
 */
const postDeleteAccount = (req, res, next) => {
    const user = req.user;
    User_1.User.remove({ _id: user.id }, (err) => {
        if (err) {
            return next(err);
        }
        req.logout();
        res.status(200).send({ msg: "Your account has been deleted." });
    });
};
exports.postDeleteAccount = postDeleteAccount;
/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
const getOauthUnlink = (req, res, next) => {
    const provider = req.params.provider;
    const user = req.user;
    User_1.User.findById(user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user[provider] = undefined;
        user.tokens = user.tokens.filter((token) => token.kind !== provider);
        user.save((err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).send({ msg: provider + " account has been unlinked." });
        });
    });
};
exports.getOauthUnlink = getOauthUnlink;
/**
 * POST /reset/:token
 * Process the reset password request.
 */
const postReset = async (req, res, next) => {
    await (0, express_validator_1.check)("password", "Password must be at least 4 characters long.").isLength({ min: 4 }).run(req);
    await (0, express_validator_1.check)("confirm", "Passwords must match.").equals(req.body.password).run(req);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.send({ error: errors.array() });
    }
    async.waterfall([
        function resetPassword(done) {
            User_1.User
                .findOne({ passwordResetToken: req.params.token })
                .where("passwordResetExpires").gt(Date.now())
                .exec((err, user) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(403).send({ msg: "Password reset token is invalid or has expired." });
                }
                user.password = req.body.password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                user.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    req.logIn(user, (err) => {
                        done(err, user);
                    });
                });
            });
        },
        function sendResetPasswordEmail(user, done) {
            const transporter = nodemailer_1.default.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            const mailOptions = {
                to: user.email,
                from: "express-ts@starter.com",
                subject: "Your password has been changed",
                text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
            };
            transporter.sendMail(mailOptions, (err) => {
                res.send({ msg: "Success! Your password has been changed." });
                done(err);
            });
        }
    ], (err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};
exports.postReset = postReset;
/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
const postForgot = async (req, res, next) => {
    await (0, express_validator_1.check)("email", "Please enter a valid email address.").isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await (0, express_validator_1.sanitize)("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.send({ errors: errors.array() });
    }
    async.waterfall([
        function createRandomToken(done) {
            crypto.randomBytes(16, (err, buf) => {
                const token = buf.toString("hex");
                done(err, token);
            });
        },
        function setRandomToken(token, done) {
            User_1.User.findOne({ email: req.body.email }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return res.send({ msg: "Account with that email address does not exist." });
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        function sendForgotPasswordEmail(token, user, done) {
            const transporter = nodemailer_1.default.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            const mailOptions = {
                to: user.email,
                from: "no-reply@mapdraw.com",
                subject: "Reset your password for trips app",
                text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };
            transporter.sendMail(mailOptions, (err) => {
                res.send({ msg: 'An e-mail has been sent to' + user.email + 'with further instructions.' });
                done(err);
            });
        }
    ], (err) => {
        if (err) {
            return;
        }
        res.send({ error: err });
    });
};
exports.postForgot = postForgot;
/**
 * GET /api/facebook
 * Facebook API example.
 */
const getFacebook = (req, res, next) => {
    const user = req.user;
    const token = user.tokens.find((token) => token.kind === "facebook");
    fbgraph_1.default.setAccessToken(token.accessToken);
    fbgraph_1.default.get(`${user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err, results) => {
        if (err) {
            return next(err);
        }
        res.render("api/facebook", {
            title: "Facebook API",
            profile: results
        });
    });
};
exports.getFacebook = getFacebook;
//# sourceMappingURL=UserController.js.map