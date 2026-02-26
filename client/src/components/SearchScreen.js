import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import AutocompleteSearch from './AutocompleteSearch';

export default function SearchScreen() {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handlePlaceSelected = useCallback((place) => {
    setSelectedPlace(place);
  }, []);

  function handleAnalyze() {
    if (selectedPlace) navigate(`/dashboard/${selectedPlace.place_id}`);
  }

  return (
    <div className="app">
      <Header />
      <div className="hero">
        <h1 className="hero-title">
          Understand any place,
          <em>instantly.</em>
        </h1>
        <p className="hero-sub">AI-powered analysis of any restaurant, café, or venue.</p>
        <div className="search-wrap">
          <AutocompleteSearch onPlaceSelected={handlePlaceSelected} />
          <button className="search-btn" onClick={handleAnalyze} disabled={!selectedPlace}>
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
}
