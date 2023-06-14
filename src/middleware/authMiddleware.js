import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const checkAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const { authorization } = req.headers;
      token = authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { id } = decoded;

      req.user = await User.findById(id);
      return next();
    } catch (error) {
      return res.status(403).json({ success: false, message: error });
    }
  }

  if (!token) {
    const err = new Error("Token does not exist");
    res.status(403).json({ msg: err.message });
  }

  next();
};
