// favorites.routes.js
import express from "express";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../../../controllers/favoritesController.js";
import { verifyToken } from "../../../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getFavorites);
router.post("/:productIdentifier", addFavorite);
router.delete("/:productIdentifier", removeFavorite);

export default router;
