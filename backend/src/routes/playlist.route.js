import { Router } from "express";
import { authenticate } from "../middleware/authienticate.js";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlayList,
  getPlayAllListDetails,
  getPlayListDetails,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.get("/", authenticate, getPlayAllListDetails);
router.post("/create", authenticate, createPlaylist);
router.get("/:playlistId", authenticate, getPlayListDetails);
router.post("/:playlistId/add-problem", authenticate, addProblemToPlaylist);
router.delete("/:playlistId", authenticate, deletePlayList);
router.delete(
  "/:playlistId/remove-problem",
  authenticate,
  removeProblemFromPlaylist
);

export default router;
