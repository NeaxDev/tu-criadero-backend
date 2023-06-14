import express from "express";
import fileUpload from "express-fileupload";
import { checkAuth } from "../middleware/authMiddleware.js";
import {
  register,
  login,
  confirmAccount,
  forgotPassword,
  checkToken,
  newPassword,
  profile,
  updateProfile,
  updateProfileWithoutImage,
  updatePassword,
} from "../controllers/usersController.js";
import {
  validatorCreateUser,
  validatorLoginUser,
} from "../validators/usersValidator.js";
const router = express.Router();

//public
router.post("/register", validatorCreateUser, register);
router.post("/login", validatorLoginUser, login);
router.get("/confirm/:token", confirmAccount);
router.post("/forgot-password", forgotPassword);
router.route("/forgot-password/:token").get(checkToken).post(newPassword);

// //Private Routes
router.get("/profile", checkAuth, profile);

router.put(
  "/update-profile/:id",
  checkAuth,
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  updateProfile
);

router.put(
  "/update-profile-not-image/:id",
  checkAuth,
  updateProfileWithoutImage
);

router.put("/update-password", checkAuth, updatePassword);

export default router;
