import type { VercelRequest, VercelResponse } from '@vercel/node';
import snapsave from '../lib/snapsave.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid URL' });
  }

  try {
    const result = await snapsave(url);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch download links' });
  }
}
