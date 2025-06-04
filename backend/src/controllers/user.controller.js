import { _config } from "../config/config.js";
import { db } from "../config/database.js";
import { user } from "../models/user.model.js";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";
import { eq } from "drizzle-orm";
import { generateAccessToken } from "../services/tokenService.js";
import { Company } from "../models/company.model.js";
import { imagekit } from "../services/imagekit.js";

const generateToken = async (payload) => {
  logger.info("generating access Token..");
  const token = generateAccessToken({
    id: payload.id,
    email: payload.email,
    role: payload.role,
  });

  return token;
};

export const registerUser = async (req, res) => {
  try {
    logger.info("hitting register user");
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //check if user already exists
    const userExists = await db
      .select()
      .from(user)
      .where(eq(user.email, email));
    if (userExists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const [newUser] = await db
      .insert(user)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "user",
        avatar: "https://api.dicebear.com/9.x/pixel-art/svg",
      })
      .returning();

    //sign jwt token
    const token = await generateToken(newUser);

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: _config.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      success: true,
      message: "new user Register Successfull..",
      data: newUser,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  logger.info("hitting login route...");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //find user
  const [findUser] = await db.select().from(user).where(eq(user.email, email));
  if (!findUser) {
    return res.status(400).json({
      success: false,
      message: "Email or Password is Incorrect..",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({
      success: false,
      message: "Invalid password",
    });
  }

  //sign jwt token

  const token = await generateToken(findUser);

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: _config.NODE_ENV !== "development",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(200).json({
    success: true,
    message: "user loggedIn Successfully..",
    data: findUser,
  });
};

export const logoutUser = async (req, res) => {
  try {
    logger.info("hitting  logout route...");

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: _config.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({
      success: true,
      message: "logout successfully..",
    });
  } catch (error) {
    logger.error("logot error", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed due to an internal server error",
    });
  }
};

export const checkUser = (req, res) => {
  try {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    const { password, ...userDataToSend } = authenticatedUser;

    res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      userData: userDataToSend,
    });
  } catch (error) {
    logger.error("user check error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while retrieving user data.",
    });
  }
};

export const uploadAvatar = async (req, res) => {
    try {
        logger.info("hitting upload avatar route...");

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        const userId = req.user.id; // Get user ID from authenticated user

        // Generate a unique filename for the avatar
        const filename = `avatar_${userId}_${Date.now()}_${req.file.originalname}`;

        // Upload file to ImageKit
        const result = await imagekit.upload({
            file: req.file.buffer, // Use buffer from multer
            fileName: filename,
            folder: "/avatars" // Specify a folder for avatars
        });

        // Check if upload was successful and get the URL
        if (!result || !result.url) {
             logger.error("ImageKit upload failed or returned no URL.");
             return res.status(500).json({
                 success: false,
                 message: "Failed to upload avatar to image service."
             });
        }

        const avatarUrl = result.url;

        // Update user's avatar URL in the database
        const [updatedUser] = await db.update(user)
            .set({ avatar: avatarUrl })
            .where(eq(user.id, userId))
            .returning(); // Return the updated user data

        if (!updatedUser) {
             logger.error(`Failed to update avatar URL in DB for user ID: ${userId}.`);
             // Optionally, clean up the uploaded image from ImageKit here
             return res.status(500).json({
                 success: false,
                 message: "Failed to update user avatar in the database."
             });
        }

        logger.info(`Avatar updated for user ${userId}: ${avatarUrl}`);

        // Exclude password from the response
        const { password, ...userDataToSend } = updatedUser;

        res.status(200).json({
            success: true,
            message: "Avatar uploaded and updated successfully.",
            data: userDataToSend,
        });

    } catch (error) {
        logger.error("upload avatar error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during avatar upload.",
            error: error.message
        });
    }
};


export const getLoggedInUser = async(req,res)=>{
    try {
        logger.info("hitting get logged in user route....");

        // Assuming authentication middleware has populated req.user
        const authenticatedUser = req.user;

        if (!authenticatedUser) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated.",
            });
        }

        // Exclude password from the response for security
        const { password, ...userDataToSend } = authenticatedUser;

        res.status(200).json({
            success: true,
            message: "Logged in user data fetched successfully",
            data: userDataToSend,
        });

    } catch (error) {
        logger.error("get logged in user error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching logged in user data.",
            error: error.message
        });
    }
}


export const getUserDetailsApi = async(req,res)=>{
  try {
    logger.info("hitting get user details by ID route...");
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Find user by ID
    const [userDetails] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId));

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Exclude password from the response
    const { password, ...userDataToSend } = userDetails;

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: userDataToSend
    });

  } catch (error) {
    logger.error("get user details error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching user details",
      error: error.message
    });
  }
}



