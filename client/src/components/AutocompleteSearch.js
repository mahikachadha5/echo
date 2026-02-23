import { useEffect, useRef } from 'react';
import searchIcon from '../images/searchIcon.png';
import '../styles.css';

const AutocompleteSearch = ({ onPlaceSelected }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        let interval;

        const init = () => {
            if (!window.google?.maps?.places) return false;

            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                fields: ["place_id", "name", "formatted_address"],
                types: ["establishment"]
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.place_id) onPlaceSelected(place);
            });

            return true;
        };

        if (!init()) {
            interval = setInterval(() => { if (init()) clearInterval(interval); }, 100);
        }

        return () => clearInterval(interval);
    }, [onPlaceSelected]);

    return (
        <div className='center-container'>
            <div className='search-container'>
                <img src={searchIcon} className='search-icon' alt='Search Icon' />
                <input ref={inputRef} type="text" placeholder="Search for a place" />
            </div>
        </div>
    );
};

export default AutocompleteSearch;
