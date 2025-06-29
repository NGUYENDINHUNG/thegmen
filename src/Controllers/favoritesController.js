import {
  addFavoriteService,
  removeFavoriteService,
  getFavoritesService,
} from "../services/favoritesService.js";

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const favorites = await getFavoritesService(userId);
    return res.status(201).json({
      statusCode: 201,
      message: "Lấy danh sách yêu thích thành công",
      data: favorites,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Lấy danh sách yêu thích thất bại",
    });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productIdentifier } = req.params;

    const favorite = await addFavoriteService(userId, productIdentifier);
    if (favorite.EC !== 0) {
      return res.status(favorite.EC).json({
        statusCode: favorite.EC,
        message: favorite.EM,
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "Thêm sản phẩm vào danh sách yêu thích thành công",
      data: favorite.DT,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message:
        error.message || "Thêm sản phẩm vào danh sách yêu thích thất bại",
    });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productIdentifier } = req.params;
    const favorite = await removeFavoriteService(userId, productIdentifier);
    if (favorite.EC !== 0) {
      return res.status(favorite.EC).json({
        statusCode: favorite.EC,
        message: favorite.EM,
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "Xóa sản phẩm khỏi danh sách yêu thích thành công",
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message:
        error.message || "Xóa sản phẩm khỏi danh sách yêu thích thất bại",
    });
  }
};
