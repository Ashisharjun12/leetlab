import logger from "../utils/logger.js";
import { db } from "../config/database.js";
import { playlist } from "../models/playlist.model.js";
import { problemInPlaylist } from "../models/problemInPlaylist.model.js";
import { eq, inArray ,and} from "drizzle-orm";

export const createPlaylist = async (req, res) => {
  try {
    logger.info("Creating playlist");
    const { name, description } = req.body;
    const userId = req.user.id;

    const [playlistData] = await db
      .insert(playlist)
      .values({
        name,
        description,
        userId,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      playlist: playlistData,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getPlayAllListDetails = async (req, res) => {
  try {
    logger.info("Getting all playlist details");

    const playlistDetails = await db.select().from(playlist);

    if (!playlistDetails) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Playlist details fetched successfully",
      playlist: playlistDetails,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getPlayListDetails = async (req, res) => {
  try {
    logger.info("Getting playlist details");

    const { playlistId } = req.params;

    const playlistDetails = await db
      .select()
      .from(playlist)
      .where(eq(playlist.id, playlistId));

    if (!playlistDetails) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Playlist details fetched successfully",
      playlist: playlistDetails,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  try {
    logger.info("Adding problem to playlist");
    const { playlistId } = req.params;
    const { problemIds } = req.body; // array of problme ids

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }

    console.log(
      problemIds.map((problemId) => ({
        playlistId,
        problemId,
      }))
    );

    const [playlistData] = await db.insert(problemInPlaylist).values(
      problemIds.map((problemId) => ({
        playlistId,
        problemId,
      }))
    );

    res.status(200).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemInPlaylist: playlistData,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deletePlayList = async (req, res) => {
  try {
    logger.info("Deleting playlist");
    const { playlistId } = req.params;

    const [playlistData] = await db
      .delete(playlist)
      .where(eq(playlist.id, playlistId));

    if (!playlistData) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
      playlist: playlistData,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  try {
    logger.info("Removing problem from playlist");
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }

    const [deleteProblem] = await db
      .delete(problemInPlaylist)
      .where(
        and(
          eq(problemInPlaylist.playlistId, playlistId),
          inArray(problemInPlaylist.problemId, problemIds)
        )
      );

    if (!deleteProblem) {
      return res.status(404).json({ error: "Problem not found in playlist" });
    }

    res.status(200).json({
      success: true,
      message: "Problem removed from playlist successfully",
      problemInPlaylist: deleteProblem,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
