import './ThemesCard.css';

function tier(score) {
  if (score >= 65) return 'dark';
  if (score >= 40) return 'mid';
  return 'low';
}

export default function ThemesCard({ themes }) {
  if (!themes?.length) return null;
  const sorted = [...themes].sort((a, b) => b.score - a.score);
  return (
    <div className="themes-card">
      <div className="dash-card-label">What People Talk About</div>
      {sorted.map(({ theme, score }) => {
        const t = tier(score);
        return (
          <div key={theme} className="theme-row">
            <div className="theme-name-wrap">
              <span className={`theme-name theme-name-${t}`}>{theme}</span>
            </div>
            <div className="theme-bar-track">
              <div className={`theme-bar-fill bar-${t}`} style={{ width: `${score}%` }} />
            </div>
            <span className={`theme-score score-${t}`}>{score}</span>
          </div>
        );
      })}
    </div>
  );
}
