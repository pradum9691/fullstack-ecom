import { Wishlist } from "./wishlist.model.js";

export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "products"
  );

  res.json({
    success: true,
    data: wishlist?.products || [],
  });
};

export const toggleWishlist = async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
  } else {
    const exists = wishlist.products.some(
      (p) => p.toString() === productId
    );

    if (exists) {
      wishlist.products.pull(productId);
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();
  }
  wishlist = await Wishlist.findById(wishlist._id).populate("products");

  res.json({
    success: true,
    data: wishlist.products,
  });
};

