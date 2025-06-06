import {
  addFavoriteService,
  removeFavoriteService,
  getFavoritesService,
} from "../services/favoritesService.js";

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const favorites = await getFavoritesService(userId);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productIdentifier } = req.params;

    const favorite = await addFavoriteService(userId, productIdentifier);
    res.json(favorite);
  } catch (error) {
    if (error.message === "Sản phẩm không tồn tại") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Sản phẩm đã có trong danh sách yêu thích") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productIdentifier } = req.params;
    await removeFavoriteService(userId, productIdentifier);
    res.json({ message: "Đã xóa khỏi danh sách yêu thích" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
