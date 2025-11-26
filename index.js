const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/define/:word', async (req, res) => {
  const word = req.params.word;

  try {
    const apiRes = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );

    const data = await apiRes.json();

    if (!Array.isArray(data)) {
      return res.status(404).json({
        word,
        error: 'No definitions found'
      });
    }

    res.json({
      word: data[0].word,
      phonetics: data[0].phonetics,
      meanings: data[0].meanings
    });

  } catch (err) {
    console.error('Error in /api/define route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
