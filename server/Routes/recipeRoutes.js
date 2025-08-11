// import express from "express";

// import { getMealSuggestions} from "../Controllers/suggestionSeach.js";
// const router = express.Router();


// router.get("/search", getMealSuggestions )

// router.get("/search", (req, res) => {
//     res.json({ message: "working" });
// });

// export default router

import express from "express";
import { getRecipes } from "../controllers/recipeController.js";

const router = express.Router();

router.post("/", getRecipes);

export default router;