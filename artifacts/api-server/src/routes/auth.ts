import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../lib/auth";

const router = Router();

router.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email and password are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  const [user] = await db.insert(usersTable).values({
    name,
    email,
    password: hashPassword(password),
  }).returning();

  const session = req.session as any;
  session.userId = user.id;
  res.status(201).json({ id: user.id, name: user.name, email: user.email, image: user.image });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user || !verifyPassword(password, user.password)) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const session = req.session as any;
  session.userId = user.id;
  res.json({ id: user.id, name: user.name, email: user.email, image: user.image });
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Logged out" });
  });
});

router.get("/auth/me", async (req, res) => {
  const session = req.session as any;
  if (!session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, session.userId)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  res.json({ id: user.id, name: user.name, email: user.email, image: user.image });
});

export default router;
