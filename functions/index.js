/**
 * Cloud Functions entry point
 */
const functions = require('firebase-functions');
const textToSpeech = require('@google-cloud/text-to-speech');
const cors = require('cors')({ origin: true });

const client = new textToSpeech.TextToSpeechClient();

exports.speak = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    const { text, voice = 'en-GB-Wavenet-D' } = req.body || {};
    if (typeof text !== 'string') {
      return res.status(400).send('Missing text');
    }
    try {
      const [response] = await client.synthesizeSpeech({
        input: { text },
        voice: { languageCode: 'en-GB', name: voice },
        audioConfig: { audioEncoding: 'MP3' },
      });
      res.set('Content-Type', 'audio/mpeg');
      res.send(response.audioContent);
    } catch (err) {
      console.error('TTS failed', err);
      res.status(500).send('TTS error');
    }
  });
});
