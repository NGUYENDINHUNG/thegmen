// import { globalSearchService } from "../service/searchService.js";

// export const globalSearch = async (req, res) => {
//   try {
//     const { q, page, limit } = req.query;
//     const userId = req.user._id;

//     // Kiểm tra từ khóa tìm kiếm
//     if (!q) {
//       return res.status(400).json({
//         success: false,
//         message: "Vui lòng nhập từ khóa tìm kiếm"
//       });
//     }

//     const options = {
//       page: page ? parseInt(page) : 1,
//       limit: limit ? parseInt(limit) : 10
//     };

//     const result = await globalSearchService(q, userId, options);
    
//     return res.status(200).json(result);
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Lỗi khi thực hiện tìm kiếm",
//       error: error.message
//     });
//   }
// }; 