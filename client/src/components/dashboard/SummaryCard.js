import './SummaryCard.css';

export default function SummaryCard({ summary }) {
  return (
    <div className="summary-card">
      <div className="summary-label">AI Summary</div>
      <p className="summary-text">{summary}</p>
    </div>
  );
}
