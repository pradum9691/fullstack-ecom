import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const photo = profile.photos?.[0]?.value;
        if (!email) return done(new Error("No email from Google"));

        let user = await User.findOne({
          $or: [{ email }, { googleId: profile.id }],
        });

        if (!user) {
          const dummy = await bcrypt.hash("GOOGLE_AUTH", 10);

          user = await User.create({
            name: profile.displayName,
            email,
            avatar: photo,
            googleId: profile.id,
            password: dummy,
            role: "CUSTOMER",
          });
        } else {
          if (!user.avatar && photo) {
            user.avatar = photo;
            await user.save();
          }
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        return done(null, {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
          },
          token,
        });
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);



export default passport;
