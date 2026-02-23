import './InsiderTipsCard.css';

export default function InsiderTipsCard({ tips }) {
  if (!tips?.length) return null;
  return (
    <div className="insider-card">
      <div className="dash-card-label">Insider Tips</div>
      <div className="insider-list">
        {tips.map((tip, i) => (
          <div key={i} className="insider-item">
            <span className="insider-icon">✦</span>
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
}
