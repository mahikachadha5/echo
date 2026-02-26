import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import AutocompleteSearch from './AutocompleteSearch';

import ThemesCard from './dashboard/ThemesCard';
import AskCard from './dashboard/AskCard';
import BestForCard from './dashboard/BestForCard';
import WhenToGoCard from './dashboard/WhenToGoCard';
import KnowBeforeYouGoCard from './dashboard/KnowBeforeYouGoCard';
import './DashboardScreen.css';


export default function DashboardScreen() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPlace, setNewPlace] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (place?.name) searchRef.current?.setValue(place.name);
  }, [place]);

  useEffect(() => {
    if (!placeId) { navigate('/'); return; }
    setAnalysis(null);
    setPlaceDetails(null);
    setPlace(null);
    setLoading(true);
    setError('');

    function fetchPlaceInfo() {
      return new Promise((resolve, reject) => {
        const attempt = () => {
          if (!window.google?.maps?.places) { setTimeout(attempt, 100); return; }
          const svc = new window.google.maps.places.PlacesService(document.createElement('div'));
          svc.getDetails(
            { placeId, fields: ['name', 'formatted_address', 'rating', 'user_ratings_total', 'url'] },
            (result, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) resolve(result);
              else reject(new Error('Place not found'));
            }
          );
        };
        attempt();
      });
    }

    async function run() {
      let info;
      try {
        info = await fetchPlaceInfo();
      } catch (e) {
        setError('Place not found');
        setLoading(false);
        return;
      }

      const placeObj = { place_id: placeId, name: info.name, address: info.formatted_address };
      setPlace(placeObj);
      setPlaceDetails(info);

      try {
        const res = await fetch('/.netlify/functions/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(placeObj),
        });
        if (!res.ok) throw new Error((await res.text()) || 'Analysis failed');
        setAnalysis(await res.json());
      } catch (e) {
        setError(e.message || 'Analysis failed');
      }
      setLoading(false);
    }

    run();
  }, [placeId, navigate]);

  function handleAnalyze() {
    if (newPlace) navigate(`/dashboard/${newPlace.place_id}`, { replace: true });
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
          <span className="loading-label">Analyzing {place?.name ?? '…'}</span>
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
              {analysis.trendDescription && <p className="dash-trend-desc">{analysis.trendDescription}</p>}
            </div>
            <div className="dash-hero-right">
              {analysis.sentimentScore != null && (
                <div className="dash-echo-score">
                  <span className="dash-echo-score-num">
                    {analysis.sentimentScore}<span className="dash-echo-score-denom">/100</span>
                  </span>
                  <span className="dash-echo-score-label">Sentiment Score</span>
                </div>
              )}
              <div className="dash-hero-btns">
                {placeDetails?.url && (
                  <button className="view-reviews-btn" onClick={() => window.open(placeDetails.url, '_blank')}>
                    View reviews ↗
                  </button>
                )}
              </div>
            </div>
          </div>

          <hr className="dash-divider" />
          <div className="dash-layout">
            <div className="dash-row-1">
              <ThemesCard themes={analysis.keyThemes} />
              <BestForCard occasions={analysis.bestFor} />
              <WhenToGoCard whenToGo={analysis.whenToGo} />
            </div>
            <div className="dash-row-2">
              <KnowBeforeYouGoCard items={analysis.headsUp} tips={analysis.insiderTips} />
              <AskCard place={place} questions={analysis.suggestedQuestions?.slice(0, 2)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
