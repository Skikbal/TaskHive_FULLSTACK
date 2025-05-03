const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";
  console.log(err.stack)
  const response = {
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    ...(err.errors && { error: err.errors }),
    ...(isProduction ? {} : { stack: err.stack }),
  };
  res.status(err.statusCode).json(response);
};

export default errorHandler;
