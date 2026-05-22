import { Router } from "express";
import { db, tutorsTable, playlistsTable, contentTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/tutors", async (req, res) => {
  const tutors = await db.select().from(tutorsTable);

  const result = await Promise.all(
    tutors.map(async (t) => {
      const [{ playlistCount }] = await db.select({ playlistCount: count() }).from(playlistsTable).where(eq(playlistsTable.tutorId, t.id));
      return {
        id: t.id,
        name: t.name,
        email: t.email,
        profession: t.profession,
        image: t.image,
        playlistCount,
      };
    })
  );

  res.json(result);
});

router.get("/tutors/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [tutor] = await db.select().from(tutorsTable).where(eq(tutorsTable.id, id)).limit(1);
  if (!tutor) {
    res.status(404).json({ error: "Tutor not found" });
    return;
  }

  const [{ playlistCount }] = await db.select({ playlistCount: count() }).from(playlistsTable).where(eq(playlistsTable.tutorId, id));

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
    .where(eq(playlistsTable.tutorId, id));

  const enrichedPlaylists = await Promise.all(
    playlists.map(async (p) => {
      const [{ videoCount }] = await db.select({ videoCount: count() }).from(contentTable).where(eq(contentTable.playlistId, p.id));
      return { ...p, tutorName: tutor.name, videoCount };
    })
  );

  res.json({
    id: tutor.id,
    name: tutor.name,
    email: tutor.email,
    profession: tutor.profession,
    image: tutor.image,
    playlistCount,
    playlists: enrichedPlaylists,
  });
});

export default router;
