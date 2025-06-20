import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Development server for serving the built site
// Serve the files from the dist directory produced by `npm run build`
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, 'dist');

app.use(express.static(distPath));

// Fallback to index.html so client-side routing works
// Send index.html for any unmatched route
app.use((_, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(5174, () => {
  console.log('Server running on http://localhost:5174');
});
