import { useState } from 'react';
import './KnowBeforeYouGoCard.css';

const FILTERS = [
  { key: 'tips', label: 'Pro Tips', icon: '✦' },
  { key: 'headsup', label: 'Heads Up', icon: '!' },
];

export default function KnowBeforeYouGoCard({ items, tips }) {
  const [active, setActive] = useState('tips');

  if (!items?.length && !tips?.length) return null;

  const headsUpItems = (items || []).map(text => ({ type: 'headsup', text }));
  const tipItems = (tips || []).map(text => ({ type: 'tips', text }));

  const visible = active === 'headsup' ? headsUpItems : tipItems;

  return (
    <div className="kbyg-card">
      <div className="dash-card-label">Know Before You Go</div>
      <div className="kbyg-filters">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`kbyg-filter${active === f.key ? ' kbyg-filter--active' : ''}`}
            onClick={() => setActive(f.key)}
          >
            {f.icon && <span className={`kbyg-filter-icon kbyg-filter-icon--${f.key}`}>{f.icon}</span>}
            {f.label}
          </button>
        ))}
      </div>
      <div className="kbyg-list">
        {visible.map((item, i) => (
          <div key={i} className="kbyg-item">
            {item.type === 'headsup'
              ? <span className="kbyg-icon kbyg-icon--headsup">!</span>
              : <span className="kbyg-icon kbyg-icon--tips">✦</span>
            }
            <span className="kbyg-text">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
