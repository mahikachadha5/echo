import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import AutocompleteSearch from './AutocompleteSearch';
import ClaudeTakeCard from './dashboard/ClaudeTakeCard';
import SentimentCard from './dashboard/SentimentCard';
import ThemesCard from './dashboard/ThemesCard';
import AskCard from './dashboard/AskCard';
import VibeCard from './dashboard/VibeCard';
import BestForCard from './dashboard/BestForCard';
import WhenToGoCard from './dashboard/WhenToGoCard';
import HeadsUpCard from './dashboard/HeadsUpCard';
import InsiderTipsCard from './dashboard/InsiderTipsCard';
import './DashboardScreen.css';

function RatingStars({ rating }) {
  const full = Math.floor(rating ?? 0);
  return (
    <div className="dash-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`dash-star ${i <= full ? 'dash-star-filled' : 'dash-star-empty'}`}>★</span>
      ))}
    </div>
  );
}

export default function DashboardScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPlace, setNewPlace] = useState(null);
  const searchRef = useRef(null);

  const place = state?.place;

  useEffect(() => {
    if (place?.name) searchRef.current?.setValue(place.name);
  }, [place]);

  useEffect(() => {
    if (!place) { navigate('/'); return; }
    setAnalysis(null);
    setPlaceDetails(null);
    setLoading(true);
    setError('');

    async function fetchAnalysis() {
      const res = await fetch('/.netlify/functions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(place),
      });
      if (!res.ok) throw new Error((await res.text()) || 'Analysis failed');
      return res.json();
    }

    function fetchPlaceDetails() {
      return new Promise((resolve) => {
        const attempt = () => {
          if (!window.google?.maps?.places) { setTimeout(attempt, 100); return; }
          const svc = new window.google.maps.places.PlacesService(document.createElement('div'));
          svc.getDetails(
            { placeId: place.place_id, fields: ['rating', 'user_ratings_total', 'url'] },
            (result, status) => resolve(status === window.google.maps.places.PlacesServiceStatus.OK ? result : null)
          );
        };
        attempt();
      });
    }

    Promise.allSettled([fetchAnalysis(), fetchPlaceDetails()]).then(([ai, pd]) => {
      if (ai.status === 'fulfilled') setAnalysis(ai.value);
      else setError(ai.reason?.message || 'Analysis failed');
      if (pd.status === 'fulfilled') setPlaceDetails(pd.value);
      setLoading(false);
    });
  }, [place, navigate]);

  function handleAnalyze() {
    if (newPlace) navigate('/dashboard', { state: { place: newPlace }, replace: true });
  }

  const searchBar = (
    <div className="search-wrap header-search">
      <AutocompleteSearch ref={searchRef} onPlaceSelected={setNewPlace} />
      <button className="search-btn" onClick={handleAnalyze} disabled={!newPlace}>Analyze</button>
    </div>
  );

  if (loading) {
    return (
      <div className="app app-dashboard">
        <Header showPoweredBy>{searchBar}</Header>
        <div className="loading-state">
          <div className="loading-spinner" />
          <span className="loading-label">Analyzing {place?.name}…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app app-dashboard">
      <Header showPoweredBy>{searchBar}</Header>
      {error && <div className="error-bar" style={{ margin: '16px 48px 0' }}>{error}</div>}
      {analysis && (
        <div className="dash-page">
          {/* Place hero */}
          <div className="dash-hero">
            <div>
              <h1 className="dash-place-name">{place.name}</h1>
              <p className="dash-place-addr">{place.address}</p>
            </div>
            <div className="dash-hero-right">
              {placeDetails?.rating && (
                <div className="dash-rating-row">
                  <RatingStars rating={placeDetails.rating} />
                  <span className="dash-rating-num">{placeDetails.rating}</span>
                  <span className="dash-review-count">({placeDetails.user_ratings_total?.toLocaleString()} reviews)</span>
                </div>
              )}
              {placeDetails?.url && (
                <button className="view-reviews-btn" onClick={() => window.open(placeDetails.url, '_blank')}>
                  View reviews ↗
                </button>
              )}
            </div>
          </div>

          {/* Claude's take — full width */}
          <div className="dash-take-wrap">
            <ClaudeTakeCard take={analysis.claudeTake} />
          </div>

          {/* Two-column layout */}
          <div className="dash-columns">
            <div className="dash-col-left">
              <AskCard place={place} suggestedQuestions={analysis.suggestedQuestions} />
              <SentimentCard
                score={analysis.sentimentScore}
                trend={analysis.trend}
                trendDescription={analysis.trendDescription}
              />
              <ThemesCard themes={analysis.keyThemes} />
              
            </div>
            <div className="dash-col-right">
              <VibeCard tags={analysis.vibeTags} />
              <BestForCard occasions={analysis.bestFor} />
              <WhenToGoCard whenToGo={analysis.whenToGo} />
              <HeadsUpCard items={analysis.headsUp} />
              <InsiderTipsCard tips={analysis.insiderTips} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
