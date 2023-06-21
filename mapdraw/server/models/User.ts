import bcrypt from "bcrypt";
import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;

    facebook: string;
    twitter: string,
    google: string,
    tokens: AuthToken[];

    profile: {
        name: string
    };
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;

export interface AuthToken {
    accessToken: string;
    kind: string;
}

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    facebook: String,
    twitter: String,
    google: String,
    tokens: Array,

    profile: {
        name: String,
    },

}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
    console.log('pre save');

    const user = this as UserDocument;

    if (!user.isModified("password")) { return next(); }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        console.log(' err ', err);
        console.log(' salt ', salt);

        bcrypt.hash(user.password, salt, (err: mongoose.Error, hash) => {
            console.log(' hash ', hash);
            console.log(' err ', err);
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

userSchema.methods.comparePassword = comparePassword;

export const User = mongoose.model<UserDocument>("User", userSchema);
