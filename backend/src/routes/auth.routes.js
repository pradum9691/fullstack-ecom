import express from "express";
import {
  login,
  getMe,
  logout,
  register,
  changePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import passport from "../config/passport.js";
import {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/login", loginLimiter, login);
router.post("/register", registerLimiter, register);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);

router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }

    const { token, user } = req.user;

    res.redirect(
      `${process.env.FRONTEND_URL}/google-success?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user),
      )}`,
    );
  },
);

export default router;
