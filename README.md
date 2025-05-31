# Schema Database - Fashion Store

## Tổng Quan
Schema này được thiết kế cho một cửa hàng thời trang, với các bảng chính quản lý sản phẩm, danh mục, kích thước, màu sắc và biến thể sản phẩm.

## Cấu Trúc Database

### 1. Bảng Categories (Danh Mục)
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- Quản lý các danh mục sản phẩm (ví dụ: Áo, Quần, Giày...)
- Mỗi danh mục có tên, slug (URL thân thiện), mô tả và hình ảnh

### 2. Bảng Sizes (Kích Thước)
```sql
CREATE TABLE sizes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);
```
- Lưu trữ các kích thước có sẵn (ví dụ: S, M, L, XL...)
- Mỗi kích thước có tên và mô tả

### 3. Bảng Colors (Màu Sắc)
```sql
CREATE TABLE colors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(7) NOT NULL UNIQUE,
    description TEXT
);
```
- Quản lý các màu sắc sản phẩm
- Mỗi màu có tên, mã màu (hex code) và mô tả

### 4. Bảng Products (Sản Phẩm)
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- Lưu trữ thông tin cơ bản của sản phẩm
- Mỗi sản phẩm thuộc về một danh mục
- Có giá cơ bản và thông tin mô tả

### 5. Bảng Product_Images (Hình Ảnh Sản Phẩm)
```sql
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- Lưu trữ nhiều hình ảnh cho mỗi sản phẩm
- Có thể đánh dấu hình ảnh chính

### 6. Bảng Product_Variants (Biến Thể Sản Phẩm)
```sql
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    size_id INTEGER REFERENCES sizes(id),
    color_id INTEGER REFERENCES colors(id),
    sku VARCHAR(50) UNIQUE,
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- Quản lý các biến thể của sản phẩm (kết hợp size và màu)
- Mỗi biến thể có SKU riêng, giá điều chỉnh và số lượng tồn kho

## Mối Quan Hệ
1. Một Category có nhiều Products (1-n)
2. Một Product có nhiều Product_Images (1-n)
3. Một Product có nhiều Product_Variants (1-n)
4. Một Product_Variant kết nối với một Size và một Color (n-1)

## Ví Dụ Sử Dụng

### Tạo Sản Phẩm Mới
```sql
-- 1. Tạo sản phẩm
INSERT INTO products (name, slug, description, price, category_id)
VALUES ('Áo Thun Basic', 'ao-thun-basic', 'Áo thun cotton 100%', 199000, 1);

-- 2. Thêm hình ảnh
INSERT INTO product_images (product_id, image_url, is_primary)
VALUES (1, 'https://example.com/ao-thun-1.jpg', true);

-- 3. Tạo biến thể
INSERT INTO product_variants (product_id, size_id, color_id, sku, stock_quantity)
VALUES (1, 1, 1, 'TSHIRT-S-WHITE', 100);
```

### Truy Vấn Sản Phẩm với Biến Thể
```sql
SELECT 
    p.name as product_name,
    s.name as size,
    c.name as color,
    pv.sku,
    pv.stock_quantity
FROM products p
JOIN product_variants pv ON p.id = pv.product_id
JOIN sizes s ON pv.size_id = s.id
JOIN colors c ON pv.color_id = c.id
WHERE p.id = 1;
```

## Lưu ý
- Tất cả các bảng đều có timestamps để theo dõi thời gian tạo và cập nhật
- Các trường quan trọng đều có ràng buộc UNIQUE để tránh trùng lặp
- Sử dụng REFERENCES để đảm bảo tính toàn vẹn dữ liệu
- Các bảng được thiết kế để dễ dàng mở rộng và bảo trì 


// Giả sử chúng ta có productId và muốn lấy tất cả variants của sản phẩm đó, group theo màu
const getVariantsByColor = async (productId) => {
  const result = await Variant.aggregate([
    // Lọc variants của sản phẩm
    { $match: { 
      productId: new ObjectId(productId),
      isDeleted: false 
    }},
    // Group theo màu
    { $group: {
      _id: "$color",
      sizes: {
        $push: {
          size: "$size",
          stock: "$stock",
          sku: "$sku",
          price: "$price",
          images: "$images"
        }
      }
    }},
    // Đổi tên trường _id thành color
    { $project: {
      _id: 0,
      color: "$_id",
      sizes: 1
    }}
  ]);

  return result;
};