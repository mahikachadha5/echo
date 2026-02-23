import './HeadsUpCard.css';

export default function HeadsUpCard({ items }) {
  if (!items?.length) return null;
  return (
    <div className="headsup-card">
      <div className="dash-card-label">Heads Up</div>
      <div className="headsup-list">
        {items.map((item, i) => (
          <div key={i} className="headsup-item">
            <span className="headsup-icon">!</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
