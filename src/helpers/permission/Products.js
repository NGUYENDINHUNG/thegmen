export const ProductPermission = {
  groupName: "Sản phẩm",
  permissions: [
    {
      path: "/api/v1/admin/product/list",
      method: "get",
      name: "VIEW_LIST_PRODUCTS",
      label: "Xem danh sách",
    },
    {
      path: "/api/v1/admin/product/add",
      method: "post",
      name: "ADD_PRODUCT",
      label: "Tạo mới",
    },
    {
      path: "/api/v1/admin/product/detail/*",
      method: "get",
      name: "VIEW_PRODUCT_DETAIL",
      label: "Xem chi tiết",
    },
    {
      path: "/api/v1/admin/product/*",
      method: "put",
      name: "EDIT_PRODUCT",
      label: "Chỉnh sửa",
    },
    {
      path: "/api/v1/admin/product/delete/*",
      method: "delete",
      name: "DELETE_PRODUCT",
      label: "Xóa",
    },
    {
      path: "/api/v1/admin/product/search",
      method: "get",
      name: "SEARCH_PRODUCT",
      label: "Tìm kiếm",
    },
  ],
};
