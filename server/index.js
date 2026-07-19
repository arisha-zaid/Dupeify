import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
import { pipeline } from '@xenova/transformers';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.PINECONE_API_KEY;
const indexName = process.env.PINECONE_INDEX || 'perfumes';

if (!apiKey || apiKey === 'your-pinecone-api-key') {
  console.warn('WARNING: PINECONE_API_KEY is not configured or is set to placeholder.');
}

console.log('Initializing local embedding model (Xenova/all-MiniLM-L6-v2)...');
const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

const getEmbedding = async (text) => {
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
};

const pc = new Pinecone({ apiKey });
const index = pc.index(indexName);

// GET /api/search
app.get('/api/search', async (req, res) => {
  const queryText = req.query.q;
  if (!queryText) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    console.log(`Generating embedding for search query: "${queryText}"`);
    const queryVector = await getEmbedding(queryText);

    console.log(`Querying Pinecone index "${indexName}"...`);
    const queryResponse = await index.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true
    });

    const results = queryResponse.matches.map(match => ({
      id: match.id,
      score: match.score,
      ...match.metadata
    }));

    res.json(results);
  } catch (error) {
    console.error('Search query failed:', error);
    res.status(500).json({ error: 'Search request failed', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', index: indexName });
});

app.get("/", (req, res) => {
  res.json({
    message: "Dupeify API is running",
    health: "/health",
    search: "/api/search?q=dior"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
