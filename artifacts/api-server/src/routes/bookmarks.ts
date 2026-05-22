import { Router } from "express";
import { db, bookmarksTable, playlistsTable, tutorsTable, contentTable } from "@workspace/db";
import { eq, count, and } from "drizzle-orm";

const router = Router();

router.get("/bookmarks", async (req, res) => {
  const session = req.session as any;
  if (!session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const bookmarks = await db
    .select({
      bookmarkId: bookmarksTable.id,
      playlistId: playlistsTable.id,
      title: playlistsTable.title,
      description: playlistsTable.description,
      image: playlistsTable.image,
      tutorName: tutorsTable.name,
      bookmarkedAt: bookmarksTable.createdAt,
    })
    .from(bookmarksTable)
    .leftJoin(playlistsTable, eq(bookmarksTable.playlistId, playlistsTable.id))
    .leftJoin(tutorsTable, eq(playlistsTable.tutorId, tutorsTable.id))
    .where(eq(bookmarksTable.userId, session.userId));

  const result = await Promise.all(
    bookmarks.map(async (b) => {
      if (!b.playlistId) return { ...b, videoCount: 0 };
      const [{ videoCount }] = await db.select({ videoCount: count() }).from(contentTable).where(eq(contentTable.playlistId, b.playlistId));
      return { ...b, videoCount };
    })
  );

  res.json(result);
});

router.post("/bookmarks", async (req, res) => {
  const session = req.session as any;
  if (!session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { playlistId } = req.body;
  if (!playlistId) {
    res.status(400).json({ error: "playlistId is required" });
    return;
  }

  const [existing] = await db.select().from(bookmarksTable).where(
    and(eq(bookmarksTable.userId, session.userId), eq(bookmarksTable.playlistId, parseInt(playlistId)))
  ).limit(1);

  if (existing) {
    res.status(200).json({ success: true, message: "Already bookmarked" });
    return;
  }

  await db.insert(bookmarksTable).values({ userId: session.userId, playlistId: parseInt(playlistId) });
  res.status(201).json({ success: true, message: "Bookmarked" });
});

router.delete("/bookmarks/:playlistId", async (req, res) => {
  const session = req.session as any;
  if (!session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const playlistId = parseInt(req.params.playlistId);
  await db.delete(bookmarksTable).where(
    and(eq(bookmarksTable.userId, session.userId), eq(bookmarksTable.playlistId, playlistId))
  );

  res.json({ success: true, message: "Bookmark removed" });
});

router.get("/bookmarks/:playlistId/status", async (req, res) => {
  const session = req.session as any;
  const playlistId = parseInt(req.params.playlistId);

  if (!session.userId) {
    res.json({ bookmarked: false });
    return;
  }

  const [existing] = await db.select().from(bookmarksTable).where(
    and(eq(bookmarksTable.userId, session.userId), eq(bookmarksTable.playlistId, playlistId))
  ).limit(1);

  res.json({ bookmarked: !!existing });
});

export default router;
