import { db } from "../config/database.js";
import { user } from "../models/user.model.js";
import { eq } from "drizzle-orm";

export const checkAdmin = async (req, res, next) => {
    try {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No user logged in."
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Admin access required."
            });
        }


        next();
    } catch (error) {
        console.error("Error in checkAdmin middleware:", error); 
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};
