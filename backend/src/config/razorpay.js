import Razorpay from "razorpay";

let _razorpay = null;

export const getRazorpay = () => {
  if (_razorpay) return _razorpay;

  if (!process.env.RAZORPAY_KEY_ID) {
    throw new Error("Razorpay env not loaded yet");
  }

  _razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  return _razorpay;
};
