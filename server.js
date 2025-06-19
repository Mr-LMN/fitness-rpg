import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Development server for serving the built site

app.use(express.static('public'));

app.listen(5174, () => {
  console.log('Server running on http://localhost:5174');
});
