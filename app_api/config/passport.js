const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/user");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
        },
        async (username, password, done) => {
            console.log('Attempting login with:', { email: username, password: password });

            try {
                const user = await User.findOne({ email: username }).exec();
                if (!user) {
                    console.log("User not found");
                    return done(null, false, {
                        message: "Incorrect username.",
                    });
                }
                if (!user.validPassword(password)) {
                    console.log("Password mismatch");
                    return done(null, false, {
                        message: "Incorrect password.",
                    });
                }
                console.log("User authenticated successfully");
                return done(null, user);
            } catch (err) {
                console.log("Error during authentication:", err);
                return done(err);
            }
        }
    )
);
