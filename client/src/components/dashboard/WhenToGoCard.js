import './WhenToGoCard.css';

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
        <div className="whentogo-text">{whenToGo.bestTime}</div>
      </div>
      <div className="whentogo-row">
        <div className="whentogo-sublabel">
          <span className="whentogo-dot dot-muted" />
          Avoid
        </div>
        <div className="whentogo-text">{whenToGo.avoid}</div>
      </div>
    </div>
  );
}
