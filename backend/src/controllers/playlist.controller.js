import logger from "../utils/logger.js";
import { db } from "../config/database.js";
import { playlist } from "../models/playlist.model.js";
import { problemInPlaylist } from "../models/problemInPlaylist.model.js";
import { eq, inArray, and } from "drizzle-orm";
import { problem } from "../models/problem.model.js";

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
    logger.info("Getting all playlist details for user");
    const userId = req.user.id;

    const playlistDetails = await db
      .select()
      .from(playlist)
      .where(eq(playlist.userId, userId))
      .orderBy(playlist.createdAt);

    if (!playlistDetails || playlistDetails.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No playlists found for this user",
        playlist: [],
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
    const userId = req.user.id;

    const [playlistDetails] = await db
      .select()
      .from(playlist)
      .where(
        and(
          eq(playlist.id, playlistId),
          eq(playlist.userId, userId)
        )
      );

    if (!playlistDetails) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found or you don't have access to it",
      });
    }

    // Get problems in the playlist
    const problemsInPlaylist = await db
      .select({
        problem: problem,
      })
      .from(problemInPlaylist)
      .innerJoin(problem, eq(problemInPlaylist.problemId, problem.id))
      .where(eq(problemInPlaylist.playlistId, playlistId));

    const problems = problemsInPlaylist.map(item => item.problem);

    res.status(200).json({
      success: true,
      message: "Playlist details fetched successfully",
      playlist: {
        ...playlistDetails,
        problems,
      },
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
    const userId = req.user.id;

    // First verify that the playlist belongs to the user
    const [playlistData] = await db
      .select()
      .from(playlist)
      .where(
        and(
          eq(playlist.id, playlistId),
          eq(playlist.userId, userId)
        )
      );

    if (!playlistData) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found or you don't have access to it",
      });
    }

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }

    const insertedProblems = await db.insert(problemInPlaylist).values(
      problemIds.map((problemId) => ({
        playlistId,
        problemId,
      }))
    ).returning();

    res.status(200).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemInPlaylist: insertedProblems,
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
    const userId = req.user.id;

    // First verify that the playlist belongs to the user
    const [playlistData] = await db
      .delete(playlist)
      .where(
        and(
          eq(playlist.id, playlistId),
          eq(playlist.userId, userId)
        )
      )
      .returning();

    if (!playlistData) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found or you don't have access to it",
      });
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
    const userId = req.user.id;

    // First verify that the playlist belongs to the user
    const [playlistData] = await db
      .select()
      .from(playlist)
      .where(
        and(
          eq(playlist.id, playlistId),
          eq(playlist.userId, userId)
        )
      );

    if (!playlistData) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found or you don't have access to it",
      });
    }

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }

    const removedProblems = await db
      .delete(problemInPlaylist)
      .where(
        and(
          eq(problemInPlaylist.playlistId, playlistId),
          inArray(problemInPlaylist.problemId, problemIds)
        )
      ).returning();

    res.status(200).json({
      success: true,
      message: "Problem removed from playlist successfully",
      problemInPlaylist: removedProblems,
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
