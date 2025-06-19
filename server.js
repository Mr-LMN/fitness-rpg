import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const API_KEY = process.env.VITE_GOOGLE_TTS_KEY || process.env.GOOGLE_TTS_KEY;

app.post('/speak', async (req, res) => {
  const { text, voice = 'en-GB-Wavenet-D' } = req.body || {};
  if (!text) return res.status(400).json({ error: 'No text provided' });
  if (!API_KEY) return res.status(500).json({ error: 'No Google TTS key set' });

  try {
    const resp = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: 'en-GB', name: voice },
        audioConfig: { audioEncoding: 'MP3' },
      }),
    });
    const data = await resp.json();
    if (data.audioContent) {
      const audio = Buffer.from(data.audioContent, 'base64');
      res.set('Content-Type', 'audio/mpeg');
      res.send(audio);
    } else {
      console.error('Google TTS error', data);
      res.status(500).json({ error: 'TTS failed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'TTS request error' });
  }
});

app.use(express.static('public'));

app.listen(5174, () => {
  console.log('Server running on http://localhost:5174');
});
