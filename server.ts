import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleScrape, searchWeb, DEMO_PRESETS, scrapeTwitter } from './src/server/apiHandler.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// API endpoints
app.get('/api/presets', (_req, res) => {
  res.json(DEMO_PRESETS);
});

app.post('/api/twitter/scrape', async (req, res) => {
  try {
    const result = await scrapeTwitter(req.body.target || '', req.body.type || 'auto');
    res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

app.all('/api/search', async (req, res) => {
  const query = (req.query.q as string) || req.body?.query || req.body?.q || '';
  const results = await searchWeb(query);
  res.json({ query, results });
});

app.post('/api/scrape', async (req, res) => {
  try {
    const result = await handleScrape(req.body);
    res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Serve frontend static assets in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Scrapling Studio server listening on http://0.0.0.0:${PORT}`);
});
