import { _config } from "../config/config.js";
import jwt from "jsonwebtoken"

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, _config.JWT_SECRET, {
      expiresIn: "7d"
    });
  };