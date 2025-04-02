import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";
const validate = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];

  errors.array.map((err) =>
    extractedErrors.push({
      [err.path]: err.msg,
    }),
  );
  throw new ApiError(422, "Validation Error !", extractedErrors);
};

export default validate;
