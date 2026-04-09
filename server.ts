import express from 'express';
import next from 'next';
import cron from 'node-cron';
import { scrapeJobs } from './lib/scraper';
import { initDb } from './lib/db';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Initialize Database
  initDb();

  // Middleware
  server.use(express.json());

  // API Routes
  server.get('/api/jobs', (req, res) => {
    // We will handle this in Next.js API routes or here
    // Let's just let Next.js handle all API routes for simplicity
    return handle(req, res);
  });

  // Schedule Cron Job (Run every 1 hour)
  cron.schedule('0 * * * *', async () => {
    console.log('Running cron job to scrape jobs...');
    try {
      await scrapeJobs();
      console.log('Scraping completed successfully.');
    } catch (error) {
      console.error('Error during scraping:', error);
    }
  });

  // Run scraper once on startup for initial data
  setTimeout(() => {
    console.log('Running initial scrape...');
    scrapeJobs().catch(console.error);
  }, 5000);

  // Default catch-all handler to allow Next.js to handle all other routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
