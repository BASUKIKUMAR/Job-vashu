import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'jobs.db');
const db = new Database(dbPath);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      postDate TEXT,
      lastDate TEXT,
      applyLink TEXT,
      sourceWebsite TEXT,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export function insertJob(job: {
  title: string;
  category: string;
  postDate?: string;
  lastDate?: string;
  applyLink?: string;
  sourceWebsite: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO jobs (title, category, postDate, lastDate, applyLink, sourceWebsite)
    VALUES (@title, @category, @postDate, @lastDate, @applyLink, @sourceWebsite)
  `);
  
  // Check if job already exists by title and category
  const existing = db.prepare('SELECT id FROM jobs WHERE title = ? AND category = ?').get(job.title, job.category);
  if (!existing) {
    stmt.run({
      ...job,
      postDate: job.postDate || null,
      lastDate: job.lastDate || null,
      applyLink: job.applyLink || null
    });
  }
}

export function getJobs(category?: string, search?: string, page = 1, limit = 20) {
  let query = 'SELECT * FROM jobs WHERE status = "approved"';
  const params: any[] = [];

  if (category && category !== 'All') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND title LIKE ?';
    params.push(`%${search}%`);
  }

  query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(limit, (page - 1) * limit);

  const stmt = db.prepare(query);
  const jobs = stmt.all(...params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as count FROM jobs WHERE status = "approved"';
  const countParams: any[] = [];
  
  if (category && category !== 'All') {
    countQuery += ' AND category = ?';
    countParams.push(category);
  }

  if (search) {
    countQuery += ' AND title LIKE ?';
    countParams.push(`%${search}%`);
  }

  const countStmt = db.prepare(countQuery);
  const total = (countStmt.get(...countParams) as any).count;

  return { jobs, total };
}

export function getAdminJobs() {
  return db.prepare('SELECT * FROM jobs ORDER BY createdAt DESC').all();
}

export function updateJobStatus(id: number, status: string) {
  db.prepare('UPDATE jobs SET status = ? WHERE id = ?').run(status, id);
}

export function deleteJob(id: number) {
  db.prepare('DELETE FROM jobs WHERE id = ?').run(id);
}

export default db;
