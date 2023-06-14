import { check } from "express-validator";
import { validateResults } from "../utils/handleValidator.js";

const validatorCreateFather = [
  check("id_user").exists().notEmpty(),
  check("name").exists().notEmpty(),
  check("type_crest").exists().notEmpty(),
  check("description").exists().notEmpty(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

export { validatorCreateFather };
