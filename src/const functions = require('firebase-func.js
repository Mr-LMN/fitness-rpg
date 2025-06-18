const functions = require('firebase-functions');
const textToSpeech = require('@google-cloud/text-to-speech');
const cors = require('cors')({ origin: true });
const client = new textToSpeech.TextToSpeechClient();

exports.speak = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    const { text } = req.body;
    if (typeof text !== 'string') return res.status(400).send('Missing text');
    const [response] = await client.synthesizeSpeech({
      input:    { text },
      voice:    { languageCode:'en-GB', name:'en-GB-Wavenet-D' },
      audioConfig: { audioEncoding:'MP3' },
    });
    res.set('Content-Type','audio/mpeg');
    res.send(response.audioContent);
  });
});
