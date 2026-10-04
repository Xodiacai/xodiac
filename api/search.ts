import { searchWeb } from '../src/server/apiHandler.ts';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query?.q || req.body?.q || req.query?.query || '';
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter "q"' });
  }

  try {
    const results = await searchWeb(String(query));
    return res.status(200).json({ query, count: results.length, results });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'Search failed',
    });
  }
}
