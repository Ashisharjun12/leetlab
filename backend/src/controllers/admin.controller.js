import { db } from "../config/database.js";
import { user } from "../models/user.model.js";
import logger from "../utils/logger.js";
import { eq } from "drizzle-orm";

export const getAllUsers = async (req, res) => {
  try {
    logger.info("hitting get all users route..");

    const getUsers = await db.select().from(user);

    return res.status(200).json({
      success: true,
      message: "get all users successfully",
      data: getUsers
    });
  } catch (error) {
    logger.error("no user found", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};

export const changeRole = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Get current user
    const [currentUser] = await db.select().from(user).where(eq(user.id, userId));

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Toggle role
    const newRole = currentUser.role === 'admin' ? 'user' : 'admin';

    // Update user role
    await db.update(user)
      .set({ role: newRole })
      .where(eq(user.id, userId));

    return res.status(200).json({
      success: true,
      message: `Role changed to ${newRole} successfully`,
      data: {
        userId,
        newRole
      }
    });

  } catch (error) {
    logger.error("Error in changing user role:", error);
    return res.status(500).json({
      success: false,
      message: "Error changing user role",
      error: error.message
    });
  }
};