import './ClaudeTakeCard.css';

export default function ClaudeTakeCard({ take }) {
  if (!take) return null;
  return (
    <div className="claude-take-card">
      <div className="claude-take-label">Claude's take</div>
      <p className="claude-take-quote">"{take}"</p>
    </div>
  );
}
