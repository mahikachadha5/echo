import React, { useEffect, useRef } from 'react';
import searchIcon from '../images/searchIcon.png';
import '../styles.css';
import axios from 'axios';

const AutocompleteSearch = ({ onPlaceSelected }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (!window.google) return;

        const input = document.getElementById('search-input');

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            fields: ["place_id", "name", "formatted_address"],
            types: ["establishment"]
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.place_id) {
                onPlaceSelected(place);
            }
        });
}, [onPlaceSelected]);

  return (
    <div className='center-container'>
      <div className='search-container'>
        <img src={searchIcon} className='search-icon' alt='Search Icon'/>
        <input
            ref={inputRef}
            type="text"
            placeholder="Search for a place"
        />
      </div>
    </div>
  );
};

export default AutocompleteSearch;