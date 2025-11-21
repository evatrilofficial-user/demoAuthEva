import bcrypt from "bcryptjs";
import db from "../models/index.js";
import AppError from "../utils/AppError.js";
import { sendEmail } from "../utils/sendEmail.js";
import { tempPasswordEmailTemplate } from "../utils/tempPasswordEmail.js";

const { Admin } = db;

export const sendPasswordResetMail = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findByPk(adminId);

    if (!admin) throw new AppError("Admin not found", 404);

    const html = tempPasswordEmailTemplate(admin);

    await sendEmail(admin.email, "Your Password Has Been Reset", html);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (err) {
    next(err);
  }
};

export const resetAdminPasswordBySA = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword)
      throw new AppError("Passwords do not match", 400);

    const admin = await Admin.findByPk(adminId);
    if (!admin) throw new AppError("Admin not found", 404);

    const hashedPassword = await bcrypt.hash(password, 10);
    admin.password = hashedPassword;

    // FORCE LOGOUT OF TARGET ADMIN (NOT SUPER ADMIN)
    admin.remember_token = null;

    admin.reset_password_otp_expire = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    // Temporary field only to show in email
    admin._tempPassword = password;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset. Use email API to notify admin.",
    });
  } catch (err) {
    next(err);
  }
};
