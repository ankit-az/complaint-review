export const sendSuccess = (res, data = {}, message = null, statusCode = 200) => {
  const response = {
    success: true,
    data,
  };
  if (message) {
    response.message = message;
  }
  return res.status(statusCode).json(response);
};

export const sendError = (res, message = "Something went wrong", statusCode = 500, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default {
  sendSuccess,
  sendError,
};
