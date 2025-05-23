import { UserPermission } from "./User.js";
import { ProductPermission } from "./Product.js";
import { CategoryPermission } from "./Category.js";
import { CollectionPermission } from "./conllections.js";
import { VariantPermission } from "./Variants.js";
import { VoucherPermission } from "./Vouchers.js";
import { SupplierPermission } from "./Suppliers.js";
import { OrderPermission } from "./Order.js";
import { SliderPermission } from "./Slider.js";

export const RolePermission = {
  ADMIN: {
    name: "ADMIN",
    description: "Quyền truy cập và quản lý tất cả các tài nguyên",
    ...UserPermission,
    ...ProductPermission,
    ...CategoryPermission,
    ...CollectionPermission,
    ...VariantPermission,
    ...VoucherPermission,
    ...SupplierPermission,
    ...OrderPermission,
    ...SliderPermission,
    ...UserPermission,
  },
  USER: {
    name: "USER",
    description: "Quyền truy cập và quản lý tài nguyên của bản thân",
    ...UserPermission,

    OrderPermission: {
      CREATE_ORDER: "order:create", // Tạo đơn hàng
      CANCEL_ORDER: "order:cancel", // Hủy đơn hàng
      UPDATE_ORDER: "order:update", // Cập nhật đơn hàng
      VIEW_ORDER_DETAIL: "order:view:detail", // Xem chi tiết đơn hàng của mình
    },
  },
  GUEST: {
    name: "GUEST",
    description: "Quyền truy cập và quản lý tài nguyên của bản thân",
  },
};
