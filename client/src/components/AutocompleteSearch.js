import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const AutocompleteSearch = forwardRef(({ onPlaceSelected }, ref) => {
  const inputRef = useRef(null);

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
      placeholder="Search a place..."
      className="search-input"
    />
  );
});

export default AutocompleteSearch;
