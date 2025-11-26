const form = document.getElementById('lookup-form');
const wordInput = document.getElementById('word-input');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');

function setStatus(message, isError = false) {
  statusEl.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = message;

  if (isError) {
    p.style.color = 'red'; // you can later move this into CSS
  }

  statusEl.appendChild(p);
}

function clearResults() {
  resultsEl.innerHTML = '';
}

function renderResults(data) {
  clearResults();

  const { word, phonetics = [], meanings = [] } = data;

  const title = document.createElement('h2');
  title.textContent = word;
  resultsEl.appendChild(title);

  const phonetic = phonetics.find(p => p.text)?.text;
  if (phonetic) {
    const phoneticP = document.createElement('p');
    phoneticP.innerHTML = `<strong>Phonetic:</strong> ${phonetic}`;
    resultsEl.appendChild(phoneticP);
  }

  meanings.forEach(meaning => {
    const partOfSpeech = document.createElement('h3');
    partOfSpeech.textContent = meaning.partOfSpeech;
    resultsEl.appendChild(partOfSpeech);

    const list = document.createElement('ul');

    meaning.definitions.forEach(def => {
      const li = document.createElement('li');
      li.textContent = def.definition;
      list.appendChild(li);
    });

    resultsEl.appendChild(list);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const word = wordInput.value.trim();

  if (!word) {
    setStatus('Please enter a word.', true);
    clearResults();
    return;
  }

  setStatus(`Looking up “${word}”...`);
  clearResults();

  try {
    const res = await fetch(`/api/define/${encodeURIComponent(word)}`);

    if (!res.ok) {
      let errData = null;
      try {
        errData = await res.json();
      } catch (_) {
      }

      const msg = errData?.error || `Error: ${res.status} ${res.statusText}`;
      setStatus(msg, true);
      return;
    }

    const data = await res.json();
    setStatus('Result:');
    renderResults(data);

  } catch (err) {
    console.error('Fetch error:', err);
    setStatus('Network error – please try again.', true);
    clearResults();
  }
});
