import type { VercelRequest, VercelResponse } from '@vercel/node'
import snapsave from '../lib/snapsave.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid `url` query parameter' })
  }

  try {
    const data = await snapsave(url)
    res.status(200).json(data)
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch video info', detail: err.message })
  }
}