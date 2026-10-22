import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { registerUser, loginUser, googleLoginUser } from "../services/auth.service.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";


export const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { token, user } = await registerUser(value);

    res.status(201).json({
      success: true,
      data: user,
      token,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { token, user } = await loginUser(value);

    res.json({
      success: true,
      data: user,
      token,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
    },
  });
};


export const logout = async (req, res) => {
  res.json({ success: true });
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const result = await googleLoginUser(token);

    res.json({
      success: true,
      data: result.user,
      token: result.token,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        avatar: req.body.avatar, 
      },
      { new: true }
    ).select("-password");

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your password 🔐",
    html: `
      <h3>Password Reset</h3>
      <p>Click below link to reset password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Valid for 10 minutes only</p>
    `,
  });

  res.json({ success: true, message: "Reset link sent to email" });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token invalid or expired" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ success: true, message: "Password reset successful" });
};