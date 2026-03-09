import { useState, useEffect, useRef } from 'react';
import './AskCard.css';

export default function AskCard({ place, questions }) {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [displayedAnswer, setDisplayedAnswer] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(new Set());
  const answerRef = useRef('');

  useEffect(() => {
    if (!answer) { setDisplayedAnswer(''); setShowCursor(false); return; }
    answerRef.current = answer;
    let charIndex = 0;
    let timeout;

    function tick() {
      charIndex++;
      setDisplayedAnswer(answerRef.current.slice(0, charIndex));
      if (charIndex < answerRef.current.length) {
        setShowCursor(true);
        timeout = setTimeout(tick, 35);
      } else {
        setShowCursor(false);
      }
    }

    setDisplayedAnswer('');
    setShowCursor(true);
    timeout = setTimeout(tick, 50);
    return () => clearTimeout(timeout);
  }, [answer]);

  const visibleQuestions = (questions || []).filter((_, i) => !dismissed.has(i));

  async function handleAsk(q) {
    const question = q ?? input;
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    setDisplayedAnswer('');
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

  function handleSuggestionClick(q, originalIndex) {
    setInput(q);
    setDismissed(prev => new Set([...prev, originalIndex]));
  }

  return (
    <div className="ask-card">
      <div className="dash-card-label">Ask about this place</div>
      {visibleQuestions.length > 0 && (
        <div className="ask-suggestions">
          {(questions || []).map((q, i) => dismissed.has(i) ? null : (
            <button key={i} className="ask-suggestion" onClick={() => handleSuggestionClick(q, i)}>
              {q}
            </button>
          ))}
        </div>
      )}
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
      {loading && !displayedAnswer && <div className="ask-loading-spinner"><div className="loading-spinner" /></div>}
      {displayedAnswer && (
        <div className="ask-answer-wrap">
          <p className="ask-answer-text">
            {displayedAnswer.split(/\*\*(.+?)\*\*/g).map((part, i) =>
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
            {showCursor && <span className="loading-cursor" />}
          </p>
        </div>
      )}
    </div>
  );
}
