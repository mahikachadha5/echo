import { useState } from 'react';
import './AskCard.css';

export default function AskCard({ place }) {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAsk(q) {
    const question = q ?? input;
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const res = await fetch('/.netlify/functions/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: place.name, address: place.address, question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch {
      setAnswer('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ask-card">
      <div className="dash-card-label">Ask about this place</div>
      <div className="ask-input-row">
        <input
          className="ask-input"
          placeholder="Ask anything about this place..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
        />
        <button className="ask-btn" onClick={() => handleAsk()} disabled={!input.trim() || loading}>
          Ask
        </button>
      </div>
      {loading && <p className="ask-loading-text">Thinking…</p>}
      {answer && (
        <div className="ask-answer-wrap">
          <p className="ask-answer-text">{answer}</p>
        </div>
      )}
    </div>
  );
}
