import express from "express";
import { getOccasions, updateOccasion ,getOccasionById} from "../controllers/occasionController.js";

const router = express.Router();

router.get("/get-occasion", getOccasions);//allowed for all
router.patch("/update-occasion/:slug",updateOccasion)
router.get("/get-occasion/:id",getOccasionById)//allowed for all


export default router;
