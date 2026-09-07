import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError.js";
import { sendError } from "../utils/response.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // Zod validation error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      const targetField = Array.isArray(err.meta?.target)
        ? err.meta.target.join(", ")
        : err.meta?.target || "field";
      message = `A record with this ${targetField} already exists.`;
      errors = [{ field: targetField, message: "Duplicate value" }];
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Requested record not found.";
    } else {
      statusCode = 400;
      message = "Database operation failed.";
    }
  }

  // Prisma Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid database input parameters.";
  }

  // JWT Errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please authenticate again.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please log in again.";
  }

  // Body parser syntax error
  else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Malformed JSON payload.";
  }

  // Operational vs Programmer Error Logging
  if (!err.isOperational && !(err instanceof ZodError)) {
    console.error("💥 UNHANDLED ERROR:", err);
  }

  // Return standard envelope
  return sendError(res, message, statusCode, errors);
};

export default errorHandler;
