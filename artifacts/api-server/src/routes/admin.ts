import { Router } from "express";
import { db, tutorsTable, usersTable, playlistsTable, contentTable, commentsTable, likesTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../lib/auth";

const router = Router();

router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const [tutor] = await db.select().from(tutorsTable).where(eq(tutorsTable.email, email)).limit(1);
  if (!tutor || !verifyPassword(password, tutor.password)) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const session = req.session as any;
  session.tutorId = tutor.id;
  res.json({ id: tutor.id, name: tutor.name, email: tutor.email, profession: tutor.profession, image: tutor.image });
});

router.post("/admin/logout", (req, res) => {
  const session = req.session as any;
  delete session.tutorId;
  res.json({ success: true, message: "Logged out" });
});

router.get("/admin/me", async (req, res) => {
  const session = req.session as any;
  if (!session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [tutor] = await db.select().from(tutorsTable).where(eq(tutorsTable.id, session.tutorId)).limit(1);
  if (!tutor) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  res.json({ id: tutor.id, name: tutor.name, email: tutor.email, profession: tutor.profession, image: tutor.image });
});

router.get("/admin/stats", async (req, res) => {
  const session = req.session as any;
  if (!session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [[{ totalStudents }], [{ totalPlaylists }], [{ totalVideos }], [{ totalComments }], [{ totalLikes }]] = await Promise.all([
    db.select({ totalStudents: count() }).from(usersTable),
    db.select({ totalPlaylists: count() }).from(playlistsTable),
    db.select({ totalVideos: count() }).from(contentTable),
    db.select({ totalComments: count() }).from(commentsTable),
    db.select({ totalLikes: count() }).from(likesTable),
  ]);

  res.json({ totalStudents, totalPlaylists, totalVideos, totalComments, totalLikes });
});

router.patch("/admin/profile", async (req, res) => {
  const session = req.session as any;
  if (!session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { name, profession, image, currentPassword, newPassword } = req.body;

  const [tutor] = await db.select().from(tutorsTable).where(eq(tutorsTable.id, session.tutorId)).limit(1);
  if (!tutor) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const updates: Record<string, string> = {};
  if (name) updates.name = name;
  if (profession) updates.profession = profession;
  if (image) updates.image = image;

  if (newPassword) {
    if (!currentPassword || !verifyPassword(currentPassword, tutor.password)) {
      res.status(400).json({ error: "Current password is incorrect" });
      return;
    }
    updates.password = hashPassword(newPassword);
  }

  const [updated] = await db.update(tutorsTable).set(updates).where(eq(tutorsTable.id, session.tutorId)).returning();
  res.json({ id: updated.id, name: updated.name, email: updated.email, profession: updated.profession, image: updated.image });
});

router.get("/admin/comments", async (req, res) => {
  const session = req.session as any;
  if (!session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const comments = await db
    .select({
      id: commentsTable.id,
      contentId: commentsTable.contentId,
      contentTitle: contentTable.title,
      userId: commentsTable.userId,
      tutorId: commentsTable.tutorId,
      comment: commentsTable.comment,
      createdAt: commentsTable.createdAt,
    })
    .from(commentsTable)
    .leftJoin(contentTable, eq(commentsTable.contentId, contentTable.id))
    .orderBy(commentsTable.createdAt);

  const commentsWithNames = await Promise.all(
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

  res.json(commentsWithNames);
});

router.get("/admin/playlists", async (req, res) => {
  const session = req.session as any;
  if (!session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const playlists = await db
    .select({
      id: playlistsTable.id,
      title: playlistsTable.title,
      description: playlistsTable.description,
      image: playlistsTable.image,
      status: playlistsTable.status,
      tutorId: playlistsTable.tutorId,
      createdAt: playlistsTable.createdAt,
    })
    .from(playlistsTable)
    .where(eq(playlistsTable.tutorId, session.tutorId))
    .orderBy(playlistsTable.createdAt);

  const result = await Promise.all(
    playlists.map(async (p) => {
      const [{ videoCount }] = await db.select({ videoCount: count() }).from(contentTable).where(eq(contentTable.playlistId, p.id));
      return { ...p, tutorName: null, videoCount };
    })
  );

  res.json(result);
});

export default router;
