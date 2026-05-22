import { Router } from "express";
import { db, contentTable, playlistsTable, tutorsTable, commentsTable, likesTable } from "@workspace/db";
import { eq, count, desc } from "drizzle-orm";

const router = Router();

async function enrichContent(items: typeof contentTable.$inferSelect[]) {
  return Promise.all(
    items.map(async (item) => {
      const [{ likeCount }] = await db.select({ likeCount: count() }).from(likesTable).where(eq(likesTable.contentId, item.id));
      const [{ commentCount }] = await db.select({ commentCount: count() }).from(commentsTable).where(eq(commentsTable.contentId, item.id));
      return { ...item, likeCount, commentCount };
    })
  );
}

router.get("/content", async (req, res) => {
  const { playlistId } = req.query as { playlistId?: string };

  const query = db.select().from(contentTable).orderBy(desc(contentTable.createdAt));
  const items = playlistId
    ? await db.select().from(contentTable).where(eq(contentTable.playlistId, parseInt(playlistId))).orderBy(contentTable.createdAt)
    : await query;

  res.json(await enrichContent(items));
});

router.get("/content/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [item] = await db
    .select({
      id: contentTable.id,
      playlistId: contentTable.playlistId,
      playlistTitle: playlistsTable.title,
      tutorId: contentTable.tutorId,
      tutorName: tutorsTable.name,
      title: contentTable.title,
      description: contentTable.description,
      videoUrl: contentTable.videoUrl,
      status: contentTable.status,
      createdAt: contentTable.createdAt,
    })
    .from(contentTable)
    .leftJoin(playlistsTable, eq(contentTable.playlistId, playlistsTable.id))
    .leftJoin(tutorsTable, eq(contentTable.tutorId, tutorsTable.id))
    .where(eq(contentTable.id, id))
    .limit(1);

  if (!item) {
    res.status(404).json({ error: "Content not found" });
    return;
  }

  const [{ likeCount }] = await db.select({ likeCount: count() }).from(likesTable).where(eq(likesTable.contentId, id));
  const [{ commentCount }] = await db.select({ commentCount: count() }).from(commentsTable).where(eq(commentsTable.contentId, id));

  res.json({ ...item, likeCount, commentCount });
});

router.post("/content", async (req, res) => {
  const session = req.session as any;
  if (!session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { playlistId, title, description, videoUrl, status } = req.body;
  if (!playlistId || !title || !description || !videoUrl) {
    res.status(400).json({ error: "playlistId, title, description, and videoUrl are required" });
    return;
  }

  const [item] = await db.insert(contentTable).values({
    tutorId: session.tutorId,
    playlistId: parseInt(playlistId),
    title,
    description,
    videoUrl,
    status: status || "active",
  }).returning();

  res.status(201).json({ ...item, likeCount: 0, commentCount: 0 });
});

router.patch("/content/:id", async (req, res) => {
  const session = req.session as any;
  if (!session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const id = parseInt(req.params.id);
  const { playlistId, title, description, videoUrl, status } = req.body;

  const updates: Record<string, string | number> = {};
  if (title) updates.title = title;
  if (description) updates.description = description;
  if (videoUrl) updates.videoUrl = videoUrl;
  if (status) updates.status = status;
  if (playlistId) updates.playlistId = parseInt(playlistId);

  const [item] = await db.update(contentTable).set(updates).where(eq(contentTable.id, id)).returning();
  if (!item) {
    res.status(404).json({ error: "Content not found" });
    return;
  }

  res.json({ ...item, likeCount: 0, commentCount: 0 });
});

router.delete("/content/:id", async (req, res) => {
  const session = req.session as any;
  if (!session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const id = parseInt(req.params.id);
  await db.delete(contentTable).where(eq(contentTable.id, id));
  res.json({ success: true, message: "Content deleted" });
});

export default router;
