"use strict";
exports.__esModule = true;
exports.User = void 0;
var bcrypt_1 = require("bcrypt");
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1["default"].Schema({
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    facebook: String,
    twitter: String,
    google: String,
    tokens: Array,
    profile: {
        name: String
    }
}, { timestamps: true });
/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
    console.log('pre save');
    var user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt_1["default"].genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        console.log(' err ', err);
        console.log(' salt ', salt);
        bcrypt_1["default"].hash(user.password, salt, function (err, hash) {
            console.log(' hash ', hash);
            console.log(' err ', err);
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});
var comparePassword = function (candidatePassword, cb) {
    bcrypt_1["default"].compare(candidatePassword, this.password, function (err, isMatch) {
        cb(err, isMatch);
    });
};
userSchema.methods.comparePassword = comparePassword;
exports.User = mongoose_1["default"].model("User", userSchema);
