import './BestForCard.css';

const ICONS = ['✦', '◆', '●', '◎'];

export default function BestForCard({ occasions }) {
  if (!occasions?.length) return null;
  return (
    <div className="bestfor-card">
      <div className="dash-card-label">Best For</div>
      <div className="bestfor-grid">
        {occasions.slice(0, 4).map((item, i) => (
          <div key={item} className="bestfor-item">
            <span className="bestfor-icon">{ICONS[i % ICONS.length]}</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
