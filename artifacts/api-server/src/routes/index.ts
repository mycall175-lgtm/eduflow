import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import adminRouter from "./admin";
import playlistsRouter from "./playlists";
import contentRouter from "./content";
import commentsRouter from "./comments";
import likesRouter from "./likes";
import bookmarksRouter from "./bookmarks";
import tutorsRouter from "./tutors";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(adminRouter);
router.use(playlistsRouter);
router.use(contentRouter);
router.use(commentsRouter);
router.use(likesRouter);
router.use(bookmarksRouter);
router.use(tutorsRouter);

export default router;
