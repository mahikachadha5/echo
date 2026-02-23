import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

const PROMPTS = ['Carbone in New York City', 'Ritz-Carlton Half Moon Bay', 'Ilona Boston'];

const AutocompleteSearch = forwardRef(({ onPlaceSelected }, ref) => {
  const inputRef = useRef(null);
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    let promptIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    function tick() {
      const current = PROMPTS[promptIndex];
      if (!isDeleting) {
        setPlaceholder(current.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          timeout = setTimeout(tick, 1800);
        } else {
          timeout = setTimeout(tick, 60);
        }
      } else {
        setPlaceholder(current.slice(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          promptIndex = (promptIndex + 1) % PROMPTS.length;
          timeout = setTimeout(tick, 400);
        } else {
          timeout = setTimeout(tick, 35);
        }
      }
    }

    timeout = setTimeout(tick, 600);
    return () => clearTimeout(timeout);
  }, []);

  useImperativeHandle(ref, () => ({
    setValue: (value) => {
      if (inputRef.current) {
        inputRef.current.value = value;
        inputRef.current.focus();
      }
    },
  }));

  useEffect(() => {
    let interval;
    let listener;

    const init = () => {
      if (!window.google?.maps?.places) return false;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['place_id', 'name', 'formatted_address', 'geometry'],
        types: ['establishment'],
      });

      listener = autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.place_id) return;

        onPlaceSelected({
          place_id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      });

      return true;
    };

    if (!init()) {
      interval = setInterval(() => { if (init()) clearInterval(interval); }, 100);
    }

    return () => {
      clearInterval(interval);
      if (listener) window.google?.maps?.event?.removeListener(listener);
    };
  }, [onPlaceSelected]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className="search-input"
    />
  );
});

export default AutocompleteSearch;
