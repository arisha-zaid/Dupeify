import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
import { pipeline } from '@xenova/transformers';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX || 'perfumes';

  if (!apiKey || apiKey === 'your-pinecone-api-key') {
    console.error('CRITICAL ERROR: PINECONE_API_KEY is not configured in server/.env');
    console.error('Please configure your Pinecone API Key first before running the seed script.');
    process.exit(1);
  }

  console.log('Initializing local embedding model (Xenova/all-MiniLM-L6-v2)...');
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  const getEmbedding = async (text) => {
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  };

  // Read perfumes
  const perfumesPath = path.resolve(__dirname, '../../src/data/perfumes.json');
  console.log(`Reading perfumes dataset from: ${perfumesPath}`);
  const perfumesData = await fs.readFile(perfumesPath, 'utf-8');
  const perfumes = JSON.parse(perfumesData);

  console.log('Initializing Pinecone client...');
  const pc = new Pinecone({ apiKey });

  // Try to check/create the index automatically
  try {
    const indexesList = await pc.listIndexes();
    const indexExists = indexesList.indexes.some(i => i.name === indexName);
    if (!indexExists) {
      console.log(`Index "${indexName}" does not exist. Creating serverless index...`);
      await pc.createIndex({
        name: indexName,
        dimension: 384,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      
      console.log(`Waiting for index "${indexName}" to initialize...`);
      let isReady = false;
      while (!isReady) {
        const desc = await pc.describeIndex(indexName);
        if (desc.status?.ready) {
          isReady = true;
        } else {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      console.log(`Index "${indexName}" created successfully!`);
    } else {
      console.log(`Index "${indexName}" already exists. Proceeding...`);
    }
  } catch (err) {
    console.warn(`Warning: Could not check or create index: ${err.message}. Proceeding assuming it exists.`);
  }

  const index = pc.index(indexName);
  const records = [];

  for (const item of perfumes) {
    // Generate text from descriptive tags
    const textToEmbed = `${item.original} ${item.notes.join(' ')} ${item.accords.join(' ')} ${item.mood.join(' ')}`;
    console.log(`Generating embedding for: ${item.original} (ID: ${item.id})...`);
    
    const values = await getEmbedding(textToEmbed);
    
    records.push({
      id: item.id.toString(),
      values,
      metadata: {
        original: item.original,
        dupe: item.dupe,
        brand: item.brand,
        price: item.price,
        notes: item.notes,
        similarity: item.similarity,
        image: item.image
      }
    });
  }

  console.log(`Upserting ${records.length} records to index "${indexName}"...`);
  await index.upsert(records);
  console.log('Seeding completed successfully!');
}

main().catch((err) => {
  console.error('Fatal Seeding Error:', err);
  process.exit(1);
});
