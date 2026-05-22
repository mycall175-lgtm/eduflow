import { Router } from "express";
import { db, likesTable } from "@workspace/db";
import { eq, count, and } from "drizzle-orm";

const router = Router();

router.get("/content/:id/like", async (req, res) => {
  const session = req.session as any;
  const contentId = parseInt(req.params.id);

  const [{ total }] = await db.select({ total: count() }).from(likesTable).where(eq(likesTable.contentId, contentId));

  let liked = false;
  if (session.userId) {
    const [existing] = await db.select().from(likesTable).where(
      and(eq(likesTable.contentId, contentId), eq(likesTable.userId, session.userId))
    ).limit(1);
    liked = !!existing;
  }

  res.json({ liked, count: total });
});

router.post("/content/:id/like", async (req, res) => {
  const session = req.session as any;
  const contentId = parseInt(req.params.id);

  if (!session.userId && !session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const userId = session.userId || null;
  const tutorId = session.tutorId || null;

  const condition = userId
    ? and(eq(likesTable.contentId, contentId), eq(likesTable.userId, userId))
    : and(eq(likesTable.contentId, contentId), eq(likesTable.tutorId, tutorId!));

  const [existing] = await db.select().from(likesTable).where(condition).limit(1);

  if (existing) {
    await db.delete(likesTable).where(condition);
  } else {
    await db.insert(likesTable).values({ contentId, userId, tutorId });
  }

  const [{ total }] = await db.select({ total: count() }).from(likesTable).where(eq(likesTable.contentId, contentId));
  res.json({ liked: !existing, count: total });
});

export default router;
