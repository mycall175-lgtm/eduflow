import { Router } from "express";
import { db, playlistsTable, tutorsTable, contentTable } from "@workspace/db";
import { eq, count, like, or, desc } from "drizzle-orm";

const router = Router();

router.get("/playlists", async (req, res) => {
  const { search } = req.query as { search?: string };

  const playlists = await db
    .select({
      id: playlistsTable.id,
      title: playlistsTable.title,
      description: playlistsTable.description,
      image: playlistsTable.image,
      status: playlistsTable.status,
      tutorId: playlistsTable.tutorId,
      tutorName: tutorsTable.name,
      createdAt: playlistsTable.createdAt,
    })
    .from(playlistsTable)
    .leftJoin(tutorsTable, eq(playlistsTable.tutorId, tutorsTable.id))
    .where(
      search
        ? or(
            like(playlistsTable.title, `%${search}%`),
            like(playlistsTable.description, `%${search}%`)
          )
        : eq(playlistsTable.status, "active")
    )
    .orderBy(desc(playlistsTable.createdAt));

  const result = await Promise.all(
    playlists.map(async (p) => {
      const [{ videoCount }] = await db.select({ videoCount: count() }).from(contentTable).where(eq(contentTable.playlistId, p.id));
      return { ...p, videoCount };
    })
  );

  res.json(result);
});

router.get("/playlists/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [playlist] = await db
    .select({
      id: playlistsTable.id,
      title: playlistsTable.title,
      description: playlistsTable.description,
      image: playlistsTable.image,
      status: playlistsTable.status,
      tutorId: playlistsTable.tutorId,
      tutorName: tutorsTable.name,
      tutorProfession: tutorsTable.profession,
      createdAt: playlistsTable.createdAt,
    })
    .from(playlistsTable)
    .leftJoin(tutorsTable, eq(playlistsTable.tutorId, tutorsTable.id))
    .where(eq(playlistsTable.id, id))
    .limit(1);

  if (!playlist) {
    res.status(404).json({ error: "Playlist not found" });
    return;
  }

  const videos = await db
    .select({
      id: contentTable.id,
      playlistId: contentTable.playlistId,
      tutorId: contentTable.tutorId,
      title: contentTable.title,
      description: contentTable.description,
      videoUrl: contentTable.videoUrl,
      status: contentTable.status,
      createdAt: contentTable.createdAt,
    })
    .from(contentTable)
    .where(eq(contentTable.playlistId, id))
    .orderBy(contentTable.createdAt);

  const [{ videoCount }] = await db.select({ videoCount: count() }).from(contentTable).where(eq(contentTable.playlistId, id));

  res.json({
    ...playlist,
    videoCount,
    videos: videos.map(v => ({ ...v, likeCount: 0, commentCount: 0 })),
  });
});

router.post("/playlists", async (req, res) => {
  const session = req.session as any;
  if (!session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { title, description, image, status } = req.body;
  if (!title || !description) {
    res.status(400).json({ error: "Title and description are required" });
    return;
  }

  const [playlist] = await db.insert(playlistsTable).values({
    tutorId: session.tutorId,
    title,
    description,
    image: image || null,
    status: status || "active",
  }).returning();

  res.status(201).json(playlist);
});

router.patch("/playlists/:id", async (req, res) => {
  const session = req.session as any;
  if (!session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const id = parseInt(req.params.id);
  const { title, description, image, status } = req.body;

  const [playlist] = await db.update(playlistsTable)
    .set({ title, description, image, status })
    .where(eq(playlistsTable.id, id))
    .returning();

  if (!playlist) {
    res.status(404).json({ error: "Playlist not found" });
    return;
  }

  res.json(playlist);
});

router.delete("/playlists/:id", async (req, res) => {
  const session = req.session as any;
  if (!session.tutorId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const id = parseInt(req.params.id);
  await db.delete(playlistsTable).where(eq(playlistsTable.id, id));
  res.json({ success: true, message: "Playlist deleted" });
});

export default router;
