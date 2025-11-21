import db from "../models/index.js";
import { match } from "path-to-regexp"; // ✅ npm install path-to-regexp
import AppError from "../utils/AppError.js";

const defaultPermissions = [
  { method: "get", router: "/api/v1/get-profile" },
  { method: "post", router: "/api/v1/login" },
  { method: "get", router: "/api/v1/logout" },
  { method: "post", router: "/api/v1/request-password-otp" },
  { method: "post", router: "/api/v1/reset-password-otp" },
  { method: "get", router: "/api/v1/get-occasion" },
  { method: "get", router: "/api/v1/get-occasion/:id" },
  { method: "get", router: "/api/v1/country/get" },
  { method: "get", router: "/api/v1/theme-category/get" },
  { method: "get", router: "/api/v1/admin-activity-log/get" },
  { method: "get", router: "/api/v1/admin-activity-log/:module/:id" },
  { method: "get", router: "/api/v1/change-password" },
  { method: "get", router: "/api/v1/theme-type/get/:category_id" },
  { method: "get", router: "/api/v1/user/get:/id" },
  { method: "get", router: "/api/v1/user/get" },
  // { method: "post", router: "/api/v1/webhook" },
];

export default function authorizeDynamic() {
  return async (req, res, next) => {
    try {
      const admin = req.admin;
      if (req.path.startsWith("/webhook")) {
        return next();
      }
      if (!admin?.id) throw new AppError("unauthenticated user", 401);

      // Normalize request info
      const method = req.method.toLowerCase();
      const path = req.baseUrl + req.path;

      // SuperAdmin bypass
      if (
        (admin.roles || []).some((r) => r.code.toUpperCase() === "SUPER_ADMIN")
      ) {
        return next();
      }

      // ✅ Check default permissions (with path-to-regexp support)
      const isDefaultAllowed = defaultPermissions.some((p) => {
        if (p.method !== method) return false;
        const matcher = match(p.router, { decode: decodeURIComponent });
        return matcher(path) !== false;
      });

      if (isDefaultAllowed) {
        return next();
      }

      // DB lookup
      const permission = await db.Permission.findOne({
        where: { method, router: path },
      });

      if (!permission) throw new AppError("access denied", 403);

      // In-memory check
      if (!admin.permissionsSet.has(permission.id))
        throw new AppError("access denied : insufficient permissions", 403);

      next();
    } catch (err) {
      console.error("Authorization middleware error:", err);
      throw new AppError("Internal server error", 500);
    }
  };
}
