import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";
import passport from "passport";

import { User, UserDocument, AuthToken } from "../models/User";

import { IVerifyOptions } from "passport-local";
import { WriteError } from "mongodb";
import nodemailer from "nodemailer";
import "../config/passport";

const crypto = require('crypto');
const async = require("async");

import graph from "fbgraph";


/**
 * GET /user/isloggedin
 * isloggedin
 */
export const isloggedin = (req: any, res: Response) => {
    console.log("isLoggedIn: ", req.session)
    if( req.session.passport !?? undefined){ 
        res.status(200);
        return res.json({user: req.session.passport.user.email });
    }else{
        res.status(200);
        return res.json({user: null });
    }
};

/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction) => {
    console.log('in post login'); 
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password cannot be blank").isLength({min: 1}).run(req);
    await check("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);
    console.log('errors: ', errors); 

    if (!errors.isEmpty()) {
        return res.status(422).send(errors.array());
    }

    passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
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
            
        } else {
            res.status(401).json(info);
        }
        
    })(req, res);

};

/**
 * GET /user/logout
 * Log out.
 */
export const logout = (req: Request, res: Response) => {
    req.logout();
    return res.send({});
};

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = async (req: Request, res: Response, next: NextFunction) => {

    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422)
        return res.send(errors.array());
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            return res.status(422).send( [{ msg: "Account with that email address already exists." }] );
        }

        user.save((err) => {
            
            if (err) { return next(err); }
            req.logIn(user, (err) => {
                console.log('login after sign up', err);

                if (err) {
                    return next(err);
                }
            });
            return res.status(201).send( [{ msg: "completed" }] );
        });
    });
    
};


/**
 * POST /account/profile
 * Update profile information.
 */
export const postUpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
    await check("email", "Please enter a valid email address.").isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(403).send({"errors": errors.array()});
    }

    const user = req.user as UserDocument;
    User.findById(user.id, (err, user: UserDocument) => {
        if (err) { return next(err); }
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

/**
 * POST /account/password
 * Update current password.
 */
export const postUpdatePassword = async (req: Request, res: Response, next: NextFunction) => {
    await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.send({"errors": errors.array()});
    }

    const user = req.user as UserDocument;
    User.findById(user.id, (err, user: UserDocument) => {
        if (err) { return next(err); }
        user.password = req.body.password;
        user.save(() => { // err: WriteError
            if (err) { return next(err); }
            res.status(200).send({ msg: "Password has been changed." });
        });
    });
};

/**
 * POST /account/delete
 * Delete user account.
 */
export const postDeleteAccount = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    User.remove({ _id: user.id }, (err) => {
        if (err) { return next(err); }
        req.logout();
        res.status(200).send({ msg: "Your account has been deleted." });
    });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
export const getOauthUnlink = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.params.provider;
    const user = req.user as UserDocument;
    User.findById(user.id, (err, user: any) => {
        if (err) { return next(err); }
        user[provider] = undefined;
        user.tokens = user.tokens.filter((token: AuthToken) => token.kind !== provider);
        user.save((err: WriteError) => {
            if (err) { return next(err); }
            return res.status(200).send({ msg: provider + " account has been unlinked." });
        });
    });
};


/**
 * POST /reset/:token
 * Process the reset password request.
 */
export const postReset = async (req: Request, res: Response, next: NextFunction) => {
    await check("password", "Password must be at least 4 characters long.").isLength({ min: 4 }).run(req);
    await check("confirm", "Passwords must match.").equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.send({error: errors.array() } );
    }

    async.waterfall([
        function resetPassword(done: Function) {
            User
                .findOne({ passwordResetToken: req.params.token })
                .where("passwordResetExpires").gt(Date.now())
                .exec((err, user: any) => {
                    if (err) { return next(err); }
                    if (!user) {
                        return res.status(403).send({ msg: "Password reset token is invalid or has expired." });
                    }
                    user.password = req.body.password;
                    user.passwordResetToken = undefined;
                    user.passwordResetExpires = undefined;
                    user.save((err: WriteError) => {
                        if (err) { return next(err); }
                        req.logIn(user, (err) => {
                            done(err, user);
                        });
                    });
                });
        },
        function sendResetPasswordEmail(user: UserDocument, done: Function) {
            const transporter = nodemailer.createTransport({
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
        if (err) { return next(err); }
        res.redirect("/");
    });
};


/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
export const postForgot = async (req: Request, res: Response, next: NextFunction) => {
    await check("email", "Please enter a valid email address.").isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.send({errors: errors.array()});
    }

    async.waterfall([
        function createRandomToken(done: Function) {
            crypto.randomBytes(16, (err, buf) => {
                const token = buf.toString("hex");
                done(err, token);
            });
        },
        function setRandomToken(token: AuthToken, done: Function) {
            User.findOne({ email: req.body.email }, (err, user: any) => {
                if (err) { return done(err); }
                if (!user) {
                    return res.send({ msg: "Account with that email address does not exist." });
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                user.save((err: WriteError) => {
                    done(err, token, user);
                });
            });
        },
        function sendForgotPasswordEmail(token: AuthToken, user: UserDocument, done: Function) {
            const transporter = nodemailer.createTransport({
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
        if (err) { return ; }
        res.send({error: err});
    });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
export const getFacebook = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    const token = user.tokens.find((token: any) => token.kind === "facebook");
    graph.setAccessToken(token.accessToken);
    graph.get(`${user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err: Error, results: graph.FacebookUser) => {
        if (err) { return next(err); }
        res.render("api/facebook", {
            title: "Facebook API",
            profile: results
        });
    });
};