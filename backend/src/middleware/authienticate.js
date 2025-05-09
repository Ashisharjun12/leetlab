import { eq } from "drizzle-orm";
import { _config } from "../config/config.js";
import { db } from "../config/database.js";
import { user } from "../models/user.model.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken"

export const authenticate = async (req, res, next) => {
  let token = null;
  console.log("cokkie:",req.cookies)
  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  //verify token
  try {
    const decoded = jwt.verify(token, _config.JWT_SECRET);
    logger.info(`Decoded token User: ${JSON.stringify(decoded)}`);

    //find user
    const finduser = await db
      .select()
      .from(user)
      .where(eq(user.id, decoded.id));

    if (finduser.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not found",
      });
    }
    req.user = finduser[0];

    next();
  } catch (error) {
    logger.error("error authicatcate", error);
  }
};
