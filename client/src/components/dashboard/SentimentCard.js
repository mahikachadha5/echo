import './SentimentCard.css';

const R = 50;
const CIRC = 2 * Math.PI * R;

const TREND_META = {
  improving: { label: '↑ Improving trend', cls: 'pill-improving' },
  declining:  { label: '↓ Declining trend',  cls: 'pill-declining' },
  stable:     { label: '→ Stable',            cls: 'pill-stable' },
};

export default function SentimentCard({ score, trend }) {
  const dash = (score / 100) * CIRC;
  const meta = TREND_META[trend] ?? TREND_META.stable;

  return (
    <div className="sentiment-card">
      <div className="dash-card-label">Overall Sentiment</div>
      <div className="sentiment-body">
        <div className="sentiment-ring-wrap">
          <svg className="sentiment-ring" width="120" height="120" viewBox="0 0 120 120">
            {/* Track */}
            <circle cx="60" cy="60" r={R} fill="none" stroke="#E8E7E2" strokeWidth="8" />
            {/* Progress */}
            <circle
              cx="60" cy="60" r={R}
              fill="none"
              stroke="#105420"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${CIRC}`}
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="63" textAnchor="middle" fontSize="28" fontWeight="700" fill="#1A1A1A" fontFamily="DM Serif Display, serif">{score}</text>
            <text x="60" y="77" textAnchor="middle" fontSize="12" fill="#BBB" fontFamily="DM Sans, sans-serif">/100</text>
          </svg>
        </div>
        <div className="sentiment-right">
          <span className={`sentiment-trend-pill ${meta.cls}`}>{meta.label}</span>
        </div>
      </div>
    </div>
  );
}
