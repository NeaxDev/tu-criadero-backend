import { check } from "express-validator";
import { validateResults } from "../utils/handleValidator.js";

const validatorCreateUser = [
  check("name").exists().notEmpty(),
  check("lastname").exists().notEmpty(),
  check("email").exists().notEmpty(),
  check("password").exists().notEmpty(),
  check("phone").exists().notEmpty().isLength({ min: 10 }),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validatorLoginUser = [
  check("email").exists().notEmpty(),
  check("password").exists().notEmpty(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

export { validatorCreateUser, validatorLoginUser };
