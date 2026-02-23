import './VibeCard.css';

export default function VibeCard({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="vibe-card">
      <div className="dash-card-label">Vibe & Tone</div>
      <div className="vibe-tags">
        {tags.map(tag => <span key={tag} className="vibe-tag">{tag}</span>)}
      </div>
    </div>
  );
}
