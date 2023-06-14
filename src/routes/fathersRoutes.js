import express from "express";
import fileUpload from "express-fileupload";
import { checkAuth } from "../middleware/authMiddleware.js";
import { validatorCreateFather } from "../validators/fathersValidator.js";
import { createFather } from "../controllers/fathersController.js";

const router = express.Router();

router.post(
  "/create",
  checkAuth,
  validatorCreateFather,
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  createFather
);
