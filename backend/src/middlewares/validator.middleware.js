import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";
const validate = async (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const result = errors.array();
  const extractedErrors = [];

  result.map((err) =>
    extractedErrors.push({
      [err.path]: err.msg,
    }),
  );
  next(new ApiError(422, "Validation Error !", extractedErrors));
};

export default validate;
