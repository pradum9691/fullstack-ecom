export const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  console.error("GLOBAL ERROR EXCEPTION:", err);

  res.status(statusCode).json({
    success: false,
    message,
  });
};