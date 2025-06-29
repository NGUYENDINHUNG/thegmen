import {
  addFavoriteService,
  removeFavoriteService,
  getFavoritesService,
} from "../services/favoritesService.js";

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const favorites = await getFavoritesService(userId);
    return res.status(200).json({  // ✅ Đổi thành 200
      statusCode: 200,
      message: "Lấy danh sách yêu thích thành công",
      data: favorites,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Lấy danh sách yêu thích thất bại",
    });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productIdentifier } = req.params;

    const favorite = await addFavoriteService(userId, productIdentifier);
    if (favorite.EC !== 0) {
      // ✅ Map EC sang HTTP status hợp lệ
      let statusCode = 400;
      if (favorite.EC === 404) statusCode = 404;
      if (favorite.EC === 409) statusCode = 409; // Conflict - đã tồn tại
      
      return res.status(statusCode).json({
        statusCode: statusCode,
        message: favorite.EM,
      });
    }
    
    return res.status(201).json({  // ✅ 201 cho CREATE là đúng
      statusCode: 201,
      message: "Thêm sản phẩm vào danh sách yêu thích thành công",
      data: favorite.DT,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Thêm sản phẩm vào danh sách yêu thích thất bại",
    });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productIdentifier } = req.params;
    const favorite = await removeFavoriteService(userId, productIdentifier);
    
    if (favorite.EC !== 0) {
      // ✅ Map EC sang HTTP status hợp lệ
      let statusCode = 400;
      if (favorite.EC === 404) statusCode = 404; // Not found
      
      return res.status(statusCode).json({
        statusCode: statusCode,
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
      message: "Xóa sản phẩm khỏi danh sách yêu thích thất bại",
    });
  }
};