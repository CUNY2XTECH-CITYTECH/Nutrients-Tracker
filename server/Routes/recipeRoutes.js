import express from "express";
import { getRecipes } from "../Controllers/recipeController.js";
const router = express.Router();

router.post("/", getRecipes);

export default router;