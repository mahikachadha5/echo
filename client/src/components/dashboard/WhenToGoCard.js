import './WhenToGoCard.css';

function BoldStart({ text }) {
  if (!text) return null;
  const words = text.split(' ');
  const bold = words.slice(0, 3).join(' ');
  const rest = words.slice(3).join(' ');
  return <span><strong>{bold}</strong>{rest ? ' ' + rest : ''}</span>;
}

export default function WhenToGoCard({ whenToGo }) {
  if (!whenToGo) return null;
  return (
    <div className="whentogo-card">
      <div className="dash-card-label">When to Go</div>
      <div className="whentogo-row">
        <div className="whentogo-sublabel">
          <span className="whentogo-dot dot-green" />
          Best time
        </div>
        <div className="whentogo-text"><BoldStart text={whenToGo.bestTime} /></div>
      </div>
      <div className="whentogo-row">
        <div className="whentogo-sublabel">
          <span className="whentogo-dot dot-muted" />
          Avoid
        </div>
        <div className="whentogo-text"><BoldStart text={whenToGo.avoid} /></div>
      </div>
    </div>
  );
}
