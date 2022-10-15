import { ValidationError } from "joi";
import { DEBUG_MODE } from "../config";
import CustomErrorHandler from "../services/CustomErrorHandler";

const errorHandler = (err, req, res, next) => {
  let statuscode = 500;
  let data = {
    message: "Internal server error",
    ...(DEBUG_MODE === "true" && { originalError: err.message }),
  };

  // if error is a validation error
  if (err instanceof ValidationError) {
    statuscode = 422;
    data = {
      message: err.message,
    };
  }

  // if error is a custom error
  if (err instanceof CustomErrorHandler) {
    statuscode = err.status;
    data = {
      message: err.message,
    };
  }

  return res.status(statuscode).json(data);
};

export default errorHandler;
