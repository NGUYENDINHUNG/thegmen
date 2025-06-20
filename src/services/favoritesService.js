// favoritesService.js
import mongoose from "mongoose";
import Favorites from "#models/favoritesModel.schema.js";
import Product from "#models/productModel.schema.js";

export const getFavoritesService = async (userId) => {
  const favorites = await Favorites.find({ userId }).populate({
    path: "productId",
    select: "name price slug avatar images finalPrice discount  ",
    populate: {
      path: "categories",
      select: "name slug",
    },
  });

  const userFavorites = {
    userId,
    products: favorites.map((favorites) => favorites.productId),
  };

  return userFavorites;
};

export const addFavoriteService = async (userId, productIdentifier) => {
  let product;

  if (mongoose.Types.ObjectId.isValid(productIdentifier)) {
    product = await Product.findById(productIdentifier);
  } else {
    product = await Product.findOne({ slug: productIdentifier });
  }

  if (!product) {
    throw new Error("Sản phẩm không tồn tại");
  }

  const existingFavorite = await Favorites.findOne({
    userId,
    productId: product._id,
  });

  if (existingFavorite) {
    throw new Error("Sản phẩm đã có trong danh sách yêu thích");
  }

  const favorite = await Favorites.create({
    userId,
    productId: product._id,
  });

  return favorite;
};
export const removeFavoriteService = async (userId, productIdentifier) => {
  let product;

  if (mongoose.Types.ObjectId.isValid(productIdentifier)) {
    product = await Product.findById(productIdentifier);
  } else {
    product = await Product.findOne({ slug: productIdentifier });
  }

  if (!product) {
    throw new Error("Sản phẩm không tồn tại");
  }

  const favorite = await Favorites.findOne({
    userId,
    productId: product._id,
  });

  if (!favorite) {
    throw new Error("Sản phẩm không có trong danh sách yêu thích");
  }

  await Favorites.deleteOne({
    userId,
    productId: product._id,
  });
};
