const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/user-model');
const captainModel = require('../models/captain-model');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const generateRandomPassword = () => crypto.randomBytes(16).toString('hex');

passport.use('google-user', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID.trim(),
    clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim(),
    callbackURL: `${process.env.BASE_URL || 'http://localhost:4000'}/users/auth/google/callback`
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            let user = await userModel.findOne({ email });

            if (!user) {
                // Ensure name length constraints (min 3 chars)
                let firstname = profile.name.givenName || "User";
                let lastname = profile.name.familyName || "Name";

                if (firstname.length < 3) firstname += " " + firstname; // Pad if short
                if (lastname.length < 3) lastname = lastname + " " + lastname;  // Pad if short

                // Create new user
                const hashedPassword = await userModel.hashpassword(generateRandomPassword());
                user = await userModel.create({
                    fullname: {
                        firstname: firstname,
                        lastname: lastname
                    },
                    email: email,
                    password: hashedPassword
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

passport.use('google-captain', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID.trim(),
    clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim(),
    callbackURL: `${process.env.BASE_URL || 'http://localhost:4000'}/captain/auth/google/callback`
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log("[GOOGLE-CAPTAIN] Profile received:", profile ? profile.id : "No profile");
            const email = profile.emails[0].value;
            console.log("[GOOGLE-CAPTAIN] Email:", email);

            let captain = await captainModel.findOne({ email });

            if (!captain) {
                console.log("[GOOGLE-CAPTAIN] Creating new captain...");
                // Ensure name length constraints (min 3 chars)
                let firstname = profile.name?.givenName || "Capt";
                let lastname = profile.name?.familyName || "Name";

                if (firstname.length < 3) firstname += " " + firstname; // Pad if short
                if (lastname.length < 3) lastname = lastname + " " + lastname;  // Pad if short

                // Create new captain
                const hashedPassword = await captainModel.hashpassword(generateRandomPassword());
                captain = new captainModel({
                    fullname: {
                        firstname: firstname,
                        lastname: lastname
                    },
                    email: email,
                    password: hashedPassword,
                    status: 'active',
                    vechile: {
                        // Don't set empty strings here as they trigger minlength validation (min 3)
                        capacity: 1, // Default capacity
                        vechiletype: 'Car' // Default type
                    }
                });
                await captain.save();
                console.log("[GOOGLE-CAPTAIN] New captain saved successfully");
            } else {
                console.log("[GOOGLE-CAPTAIN] Existing captain found");
            }
            return done(null, captain);
        } catch (err) {
            console.error("[GOOGLE-CAPTAIN] ERROR:", err);
            return done(err, null);
        }
    }
));

// Serialization needed for sessions (even if we just use tokens, passport might complain without this in some configs, 
// though typically with { session: false } in routes it's skipped. 
// Adding minimal serialization just in case application global session is on.)
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    // Logic to find by ID is complex since we have two collections. 
    // We can skip this if we are strictly using stateless JWTs and not session cookies.
    done(null, id);
});
