import { Store, type SessionData } from "express-session";
import { pool } from "@workspace/db";

export class PgSessionStore extends Store {
  private pruneInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.pruneInterval = setInterval(() => this.pruneSessions(), 60 * 60 * 1000);
    if (this.pruneInterval.unref) this.pruneInterval.unref();
  }

  get(sid: string, callback: (err: unknown, session?: SessionData | null) => void): void {
    pool
      .query<{ sess: SessionData; expire: Date }>(
        "SELECT sess, expire FROM session WHERE sid = $1",
        [sid]
      )
      .then((result) => {
        const row = result.rows[0];
        if (!row) return callback(null, null);
        if (row.expire < new Date()) {
          this.destroy(sid, () => callback(null, null));
          return;
        }
        callback(null, row.sess);
      })
      .catch((err) => callback(err));
  }

  set(sid: string, session: SessionData, callback?: (err?: unknown) => void): void {
    const expire = session.cookie?.expires
      ? new Date(session.cookie.expires)
      : new Date(Date.now() + (session.cookie?.maxAge ?? 86400000));

    pool
      .query(
        `INSERT INTO session (sid, sess, expire)
         VALUES ($1, $2, $3)
         ON CONFLICT (sid) DO UPDATE SET sess = $2, expire = $3`,
        [sid, JSON.stringify(session), expire]
      )
      .then(() => callback?.())
      .catch((err) => callback?.(err));
  }

  destroy(sid: string, callback?: (err?: unknown) => void): void {
    pool
      .query("DELETE FROM session WHERE sid = $1", [sid])
      .then(() => callback?.())
      .catch((err) => callback?.(err));
  }

  touch(sid: string, session: SessionData, callback?: (err?: unknown) => void): void {
    const expire = session.cookie?.expires
      ? new Date(session.cookie.expires)
      : new Date(Date.now() + (session.cookie?.maxAge ?? 86400000));

    pool
      .query("UPDATE session SET expire = $2 WHERE sid = $1", [sid, expire])
      .then(() => callback?.())
      .catch((err) => callback?.(err));
  }

  private pruneSessions(): void {
    pool.query("DELETE FROM session WHERE expire < NOW()").catch(() => {});
  }
}
