import { Router } from "express";
import { db, commentsTable, usersTable, tutorsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/content/:id/comments", async (req, res) => {
  const contentId = parseInt(req.params.id);

  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.contentId, contentId))
    .orderBy(desc(commentsTable.createdAt));

  const enriched = await Promise.all(
    comments.map(async (c) => {
      let userName = null;
      if (c.userId) {
        const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, c.userId)).limit(1);
        userName = user?.name ?? null;
      } else if (c.tutorId) {
        const [tutor] = await db.select({ name: tutorsTable.name }).from(tutorsTable).where(eq(tutorsTable.id, c.tutorId)).limit(1);
        userName = tutor?.name ?? null;
      }
      return { ...c, userName };
    })
  );

  res.json(enriched);
});

router.post("/content/:id/comments", async (req, res) => {
  const session = req.session as any;
  const contentId = parseInt(req.params.id);
  const { comment } = req.body;

  if (!comment || !comment.trim()) {
    res.status(400).json({ error: "Comment cannot be empty" });
    return;
  }

  if (!session.userId && !session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [newComment] = await db.insert(commentsTable).values({
    contentId,
    userId: session.userId || null,
    tutorId: session.tutorId || null,
    comment: comment.trim(),
  }).returning();

  let userName = null;
  if (session.userId) {
    const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, session.userId)).limit(1);
    userName = user?.name ?? null;
  } else if (session.tutorId) {
    const [tutor] = await db.select({ name: tutorsTable.name }).from(tutorsTable).where(eq(tutorsTable.id, session.tutorId)).limit(1);
    userName = tutor?.name ?? null;
  }

  res.status(201).json({ ...newComment, userName });
});

router.delete("/comments/:id", async (req, res) => {
  const session = req.session as any;
  if (!session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const id = parseInt(req.params.id);
  await db.delete(commentsTable).where(eq(commentsTable.id, id));
  res.json({ success: true, message: "Comment deleted" });
});

export default router;
