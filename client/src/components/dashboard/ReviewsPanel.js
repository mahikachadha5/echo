import './ReviewsPanel.css';

function Stars({ rating }) {
  return (
    <div className="review-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`star ${i < rating ? 'star-filled' : 'star-empty'}`}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsPanel({ reviews }) {
  if (!reviews?.length) return null;
  return (
    <div>
      <div className="reviews-panel-label">Recent Reviews</div>
      {reviews.slice(0, 5).map((r, i) => (
        <div key={i} className="review-card">
          <div className="review-header">
            <div className="review-author">
              <div className="review-avatar">{r.author_name?.[0]?.toUpperCase()}</div>
              <span className="review-name">{r.author_name}</span>
            </div>
            <span className="review-date">{r.relative_time_description}</span>
          </div>
          <Stars rating={r.rating} />
          <p className="review-text">{r.text}</p>
        </div>
      ))}
    </div>
  );
}
