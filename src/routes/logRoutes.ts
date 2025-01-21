import { Router, Request, Response } from 'express';
import { SearchOrchestrator } from '../components/SearchOrchestrator';

const router = Router();
const searchOrchestrator = new SearchOrchestrator();

router.get('/log', async (req: Request, res: Response) => {
  try {
    const { filename, lines = '100', keyword } = req.query;

    if (!filename) {
      return res.status(400).json({ error: 'filename is required' });
    }

    const numLines = parseInt(lines as string, 10);
    if (isNaN(numLines) || numLines <= 0) {
      return res.status(400).json({ error: 'lines must be a positive number' });
    }

    const results = await searchOrchestrator.searchLogs(
      filename as string,
      numLines,
      keyword as string | undefined
    );

    res.json({
      filename,
      lines: numLines,
      keyword: keyword || undefined,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error('Log search error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

export default router;
