// import Product from "../models/productModel.schema.js";
// import Order from "../models/orderModel.Schema.js";
// import Voucher from "../models/vouchersModel.schema.js";
// import User from "../models/userModel.schema.js";
// import Category from "../models/categoryModel.schema.js";

// export const globalSearchService = async (searchQuery, userId, options = {}) => {
//   try {
//     if (!searchQuery) {
//       return {
//         success: false,
//         message: "Vui lòng nhập từ khóa tìm kiếm",
//         data: null
//       };
//     }

//     const { page = 1, limit = 10 } = options;
//     const skip = (page - 1) * limit;

//     // Tìm kiếm sản phẩm
//     const productsPromise = Product.find({
//       $or: [
//         { name: { $regex: searchQuery, $options: 'i' } },
//         { description: { $regex: searchQuery, $options: 'i' } }
//       ],
//       isDeleted: false
//     })
//       .select('name price images description')
//       .limit(limit);

//     // Tìm kiếm đơn hàng (chỉ của người dùng đang đăng nhập)
//     const ordersPromise = Order.find({
//       $or: [
//         { orderCode: { $regex: searchQuery, $options: 'i' } },
//         { 'items.name': { $regex: searchQuery, $options: 'i' } }
//       ],
//       userId: userId
//     })
//       .select('orderCode status totalAmount createdAt items')
//       .sort({ createdAt: -1 })
//       .limit(limit);

//     // Tìm kiếm voucher đang hoạt động
//     const vouchersPromise = Voucher.find({
//       $or: [
//         { code: { $regex: searchQuery, $options: 'i' } },
//         { name: { $regex: searchQuery, $options: 'i' } }
//       ],
//       status: 'active',
//       endDate: { $gte: new Date() }
//     })
//       .select('code name discountType discountValue minOrderValue')
//       .limit(limit);

//     // Tìm kiếm danh mục
//     const categoriesPromise = Category.find({
//       name: { $regex: searchQuery, $options: 'i' }
//     })
//       .select('name slug')
//       .limit(limit);

//     // Thực hiện tất cả các truy vấn đồng thời
//     const [products, orders, vouchers, categories] = await Promise.all([
//       productsPromise,
//       ordersPromise,
//       vouchersPromise,
//       categoriesPromise
//     ]);

//     // Đếm số lượng kết quả mỗi loại
//     const productCount = products.length;
//     const orderCount = orders.length;
//     const voucherCount = vouchers.length;
//     const categoryCount = categories.length;
//     const totalCount = productCount + orderCount + voucherCount + categoryCount;

//     return {
//       success: true,
//       message: "Tìm kiếm thành công",
//       data: {
//         products,
//         orders,
//         vouchers,
//         categories,
//         counts: {
//           products: productCount,
//           orders: orderCount,
//           vouchers: voucherCount,
//           categories: categoryCount,
//           total: totalCount
//         }
//       }
//     };
//   } catch (error) {
//     console.error("Lỗi khi thực hiện tìm kiếm toàn cục:", error);
//     throw new Error(`Lỗi tìm kiếm: ${error.message}`);
//   }
// }; 