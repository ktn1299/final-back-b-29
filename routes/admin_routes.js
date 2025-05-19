import express from "express";
import {
  addAdmin,
  adminLogin,
  getAdmins,
  getAdminById
} from "../controllers/admin-controller.js"; // ✅ Correct!


const adminRouter = express.Router();

adminRouter.post("/signup", addAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/", getAdmins);
adminRouter.get("/:id", getAdminById);

export default adminRouter;