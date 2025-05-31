import mongoose from "mongoose";
import Product from "../models/productModel.schema.js";
import slugify from "slugify";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.DATABASE;

const categories = [
  { id: "men", name: "Đồ nam", productNames: [
    "Áo thun nam cổ tròn",
    "Áo polo nam",
    "Áo sơ mi nam dài tay",
    "Áo khoác jean nam",
    "Quần jeans nam",
    "Quần tây nam",
    "Quần short nam",
    "Bộ đồ thể thao nam"
  ]},
  { id: "women", name: "Đồ nữ", productNames: [
    "Áo thun nữ form rộng",
    "Áo sơ mi nữ tay lỡ",
    "Áo khoác bomber nữ",
    "Váy xòe nữ",
    "Váy body nữ",
    "Quần jeans nữ",
    "Quần baggy nữ",
    "Bộ đồ thể thao nữ"
  ]},
  { id: "kids", name: "Đồ trẻ em", productNames: [
    "Áo thun bé trai",
    "Áo thun bé gái",
    "Áo khoác nỉ trẻ em",
    "Váy công chúa bé gái",
    "Quần short bé trai",
    "Quần legging bé gái",
    "Bộ đồ thể thao trẻ em",
    "Quần jeans trẻ em"
  ]}
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomFashionImage() {
  // Random ảnh từ picsum.photos
  const seed = Math.floor(Math.random() * 10000);
  return `https://picsum.photos/seed/${seed}/400/600`;
}

async function seedProducts(num = 10) {
  await mongoose.connect(MONGO_URI);

  await Product.deleteMany({});

  const products = [];
  for (let i = 0; i < num; i++) {
    const category = getRandomItem(categories);
    const name = getRandomItem(category.productNames);
    products.push({
      name: name,
      price: Math.floor(Math.random() * 900000) + 100000,
      images: [getRandomFashionImage()],
      slug: slugify(name, { lower: true, strict: true, locale: "vi" }),
      description: `${name} thuộc danh mục ${category.name}. Chất liệu cao cấp, kiểu dáng hiện đại, phù hợp nhiều dịp khác nhau.`,
      supplierId: "6834a0bebe30a5f2e48d4305",
      categoryId: "682b4f1e29af60c3dcd55af2",
   
    });
  }

  await Product.insertMany(products);
  console.log(`Đã tạo ${num} sản phẩm thời trang theo danh mục!`);
  mongoose.disconnect();
}

seedProducts(50);
