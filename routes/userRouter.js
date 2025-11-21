import express from "express";
import { getAllUsers , getUserById} from "../controllers/userController.js";

const router = express.Router();

router.get("/user/get", getAllUsers); //allowed by all
router.get("/user/get/:id", getUserById);//allowed by all

export default router;
