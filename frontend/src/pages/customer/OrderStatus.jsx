import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { motion } from "framer-motion";

const OrderStatus = () => {
  const { status } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card 
          withGlow 
          glowColor={isSuccess ? "from-emerald-500/20 to-teal-500/20" : "from-rose-500/20 to-red-500/20"}
          className="max-w-md text-center"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            >
              {isSuccess ? (
                <CheckCircle2 size={80} className="text-emerald-500" />
              ) : (
                <XCircle size={80} className="text-rose-500" />
              )}
            </motion.div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            {isSuccess ? "Order Successful!" : "Order Failed"}
          </h1>
          
          <p className="text-neutral-400 mb-8">
            {isSuccess 
              ? `Thank you for your purchase. Your order ${orderId ? `#${orderId}` : ''} has been placed successfully.`
              : "Something went wrong while processing your order. Please try again or contact support."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSuccess ? (
              <>
                <Button variant="outline" onClick={() => navigate("/orders")} className="text-white border-white/20">
                  View Orders
                </Button>
                <Button variant="primary" onClick={() => navigate("/products")}>
                  Continue Shopping
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate("/cart")} className="text-white border-white/20">
                  Return to Cart
                </Button>
                <Button variant="primary" onClick={() => navigate("/checkout")}>
                  Try Again
                </Button>
              </>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default OrderStatus;
