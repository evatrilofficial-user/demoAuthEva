import { logger } from "./logger.js";
import AppError from "./AppError.js";

const handleSequelizeError = (error, res) => {
  // Log everything for developers
  logger.error(`[Sequelize Error] ${error.message}`, {
    name: error.name,
    stack: error.stack,
    errors: error.errors || [],
  });
  const extractMessage = () => {
    if (error.errors && error.errors.length > 0) {
      return error.errors.map((err) => err.message).join(", ");
    }
    return error.message;
  };

  // Return only safe, minimal responses
  switch (error.name) {
    case "SequelizeValidationError":
      return new AppError(extractMessage(), 400, true);

    case "SequelizeUniqueConstraintError":
      return new AppError(extractMessage(), 409, true);

    case "SequelizeForeignKeyConstraintError":
      return new AppError("Invalid reference. Please check related data.", 400);

    case "SequelizeConnectionError":
    case "SequelizeConnectionRefusedError":
    case "SequelizeHostNotFoundError":
    case "SequelizeHostNotReachableError":
    case "SequelizeInvalidConnectionError":
      return new AppError(
        "Service temporarily unavailable. Please try again later.",
        503
      );

    default:
      return new AppError("Internal Server Error", 500);
  }
};

export default handleSequelizeError;
