import mongoose from "mongoose";
import Slider from "../models/sliderModel.schema.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.DATABASE;

const sliderData = [
  {
    title: "Bộ sưu tập mùa hè",
    description:
      "Khám phá bộ sưu tập mới nhất với những thiết kế độc đáo cho mùa hè",
    image: "https://picsum.photos/seed/summer/1920/1080",
    link: "/collections/summer",
    position: 1,
    isActive: true,
  },
  {
    title: "Thời trang nam cao cấp",
    description: "Phong cách lịch lãm với những thiết kế nam tính, sang trọng",
    image: "https://picsum.photos/seed/men/1920/1080",
    link: "/collections/men",
    position: 2,
    isActive: true,
  },
  {
    title: "Thời trang nữ thanh lịch",
    description: "Tôn vinh vẻ đẹp nữ tính với những thiết kế tinh tế",
    image: "https://picsum.photos/seed/women/1920/1080",
    link: "/collections/women",
    position: 3,
    isActive: true,
  },
  {
    title: "Bộ sưu tập trẻ em",
    description: "Thiết kế đáng yêu, thoải mái cho các bé",
    image: "https://picsum.photos/seed/kids/1920/1080",
    link: "/collections/kids",
    position: 4,
    isActive: true,
  },
  {
    title: "Khuyến mãi đặc biệt",
    description: "Giảm giá lên đến 50% cho các sản phẩm được chọn",
    image: "https://picsum.photos/seed/sale/1920/1080",
    link: "/promotions",
    position: 5,
    isActive: true,
  },
];

async function seedSliders() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Đã kết nối với MongoDB");

    // Xóa tất cả slider cũ
    await Slider.deleteMany({});
    console.log("Đã xóa tất cả slider cũ");

    // Thêm dữ liệu mới
    await Slider.insertMany(sliderData);
    console.log(`Đã tạo ${sliderData.length} slider thành công!`);
  } catch (error) {
    console.error("Lỗi khi seed dữ liệu:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Đã ngắt kết nối với MongoDB");
  }
}

// Chạy hàm seed
seedSliders();
