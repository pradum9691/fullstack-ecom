import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useSelector } from "react-redux";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const user = useSelector((state) => state.auth.user);

  if (!product) return null;

  const requireLogin = () => {
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!requireLogin()) return;
    await addToCart(product._id, 1);
  };

  const handleBuyNow = async () => {
    if (!requireLogin()) return;
    await addToCart(product._id, 1);
    navigate("/checkout");
  };

  return (
    <div className="group rounded-2xl bg-white dark:bg-black border border-black/10 dark:border-white/10 transition">
 
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="h-[220px] overflow-hidden rounded-t-2xl cursor-pointer"
      >
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />
      </div>
 
      <div className="p-4">
        <h3 className="text-sm font-medium truncate">{product.name}</h3>
        <p className="mt-1 text-sm opacity-70">₹ {product.price}</p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-90 transition"
          >
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 py-2 rounded-full border border-black/20 dark:border-white/20 text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
