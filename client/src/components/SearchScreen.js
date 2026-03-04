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
      <img src={`${process.env.PUBLIC_URL}/pos.webp`} className="search-screen-bg" alt="" />
      <Header />
      <div className="hero">
        <h1 className="hero-title">
          Understand any place,
          <em>instantly.</em>
        </h1>
        <p className="hero-sub">Synthesizing hundreds of reviews so you don't have to.</p>
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
