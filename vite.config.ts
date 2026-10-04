import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {handleScrape, searchWeb, DEMO_PRESETS, scrapeTwitter} from './src/server/apiHandler.ts';

function scraplingApiPlugin(): Plugin {
  return {
    name: 'scrapling-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlObj = new URL(req.url || '/', 'http://localhost:3000');

        if (urlObj.pathname === '/api/presets') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(DEMO_PRESETS));
          return;
        }

        if (urlObj.pathname === '/api/twitter/scrape' && req.method === 'POST') {
          try {
            const body = await parseBody(req);
            const twitterResult = await scrapeTwitter(body.target || '', body.type || 'auto');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(twitterResult));
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: errorMsg }));
          }
          return;
        }

        if (urlObj.pathname === '/api/search') {
          let query = urlObj.searchParams.get('q') || '';
          if (!query && req.method === 'POST') {
            const body = await parseBody(req);
            query = body.query || body.q || '';
          }
          const results = await searchWeb(query);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ query, results }));
          return;
        }

        if (urlObj.pathname === '/api/scrape' && req.method === 'POST') {
          try {
            const body = await parseBody(req);
            const scrapeResult = await handleScrape(body);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(scrapeResult));
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: errorMsg }));
          }
          return;
        }

        next();
      });
    },
  };
}

function parseBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => {
      data += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), scraplingApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

