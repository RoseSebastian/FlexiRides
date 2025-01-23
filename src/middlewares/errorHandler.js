const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred.",
    error: err.message,
  });
};

export default errorHandler;
