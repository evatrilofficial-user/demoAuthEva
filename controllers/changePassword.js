import db from "../models/index.js";
import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";

const { Admin } = db;
export const changePassword = async (req, res, next) => {
  try {
    if (!req.admin) throw new AppError("Unauthorized", 401);

    const admin = await Admin.findByPk(req.admin.id);
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword)
      throw new AppError("Current password and new password are required", 400);

    if (newPassword !== confirmPassword)
      throw new AppError("New password and confirm password do not match", 400);

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) throw new AppError("Invalid current password", 401);

    // Update password
    admin.password = await bcrypt.hash(newPassword, 10);

    // FORCE LOGOUT - session invalidation
    admin.remember_token = null;

    admin.reset_password_otp_expire = null;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. Please login again.",
      forceLogout: true,
    });
  } catch (err) {
    next(err);
  }
};
