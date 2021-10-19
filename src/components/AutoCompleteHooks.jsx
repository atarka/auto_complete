import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { classnames, highlightRegex, highlightString } from '../utils/helpers'; // normally i'd use a package, but hey, no packages! =)

export default function({ value, onChange, filter, locked = false, typeDelay = 300, className = null }) {
  const [ suggestions, setSuggestions ] = useState([]);
  const [ suggestionIndex, setSuggestionIndex ] = useState(0);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isVisible, setIsVisible ] = useState(false);
  const [ isEmptySet, setIsEmptySet ] = useState(false);
  const [ lastValid, setLastValid ] = useState(value);
  const searchStringRef = useRef(value);
  const activeItemRef = useRef(null);

  const handleInputChange = useCallback((e) => onChange(e.target.value), []);

  const handleInputBlur = useCallback(() => {
    setIsVisible(false);
    if (locked) {
      // maybe that's not the most righteous way to restore last valid state,
      // maybe i should've handled all the value changes internally when locked is on and called onUpdate
      // only when a valid value is selected. but it behaves okay now i believe
      if (searchStringRef.current === '') { // we will allow user to clear it tho
        confirmValue('');
      } else {
        onChange(lastValid);
        searchStringRef.current = lastValid;
      }
    }
  }, [ lastValid ]);

  const handleInputFocus = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleItemClick = (item) => () => {
    confirmValue(item.name);
  };

  const confirmValue = useCallback((val) => {
    searchStringRef.current = val;
    onChange(val);
    setLastValid(val);
    setSuggestions([]);
  }, []);

  const handleInputKeydown = useCallback((e) => {
    switch (e.keyCode) {
      case 9: // keyboard tab key
      case 13: // keyboard enter key
        if (suggestions.length && suggestionIndex < suggestions.length) {
          confirmValue(suggestions[suggestionIndex].name);
        } else {
          return;
        }
        break;
      case 38: // keyboard up key
        setSuggestionIndex(Math.max(suggestionIndex - 1, 0));
        break;
      case 40: // keyboard down key
        setSuggestionIndex(Math.min(suggestionIndex + 1, suggestions.length - 1));
        break;
      default:
        return;
    }

    // we get here only when we process commands, so we cancel the event, since we've processed it already
    e.preventDefault();
    e.stopPropagation();
  }, [ suggestions, suggestionIndex ]);

  useEffect(() => {
    if (activeItemRef.current) {
      // we want to have our active element to be visible if the list is long and scrollable
      activeItemRef.current.scrollIntoView?.({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }, [ activeItemRef.current ]);

  useEffect(() => {
    if (!isVisible) return;
    if (value === '') {
      setSuggestions([]);
      setIsEmptySet(false);
      searchStringRef.current = value;
    } else {
      if (typeof filter === 'function') {
        if (searchStringRef.current === value) return;
        searchStringRef.current = value;
        // we wait till user finishes typing stuff, just a coupla hundreds of milliseconds,
        // this could really save us some unnecessary requests
        const timeout = setTimeout(() => {
          setIsLoading(true);
          filter(value)
            .then((items) => {
              setIsLoading(false);
              if (searchStringRef.current === value) { // this way we filter obsolete results
                // lets prepare a highlighted version. normally a filter function should provide us hints
                // on how to highlight, but i guess we'll have to da it manually upon receiving the results
                if (items.length) {
                  const hlExpr = highlightRegex(value);
                  setSuggestions(items.map((item) => ({
                    ...item,
                    highlighted: highlightString(item.name, [hlExpr]),
                  })));
                  setIsEmptySet(false);

                } else {
                  setSuggestions([]);
                  setIsEmptySet(true);
                }
                setSuggestionIndex(0);
              }
            })
            .catch(() => {
              setIsLoading(false);
              setIsEmptySet(false);
            });
        }, typeDelay);

        return () => clearTimeout(timeout); // autoclearing timeout when value changes
      }
    }
  }, [ value, isVisible ]);

  return (
    <div className={classnames("field-input-autocomplete", className, isLoading && 'loading')}>
      <input
        value={value}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeydown}
      />
      {isLoading && <div className="loading-spinner"><div /><div /></div>}
      {isVisible && isEmptySet && <div className="suggestion-items empty">No suggestions.</div>}
      {isVisible && suggestions.length > 0 && <div className="suggestion-items">
        {suggestions.map((item, index) => (
          <span
            className={classnames("suggestion-item", index === suggestionIndex && 'active')}
            key={item.name}
            ref={index === suggestionIndex ? activeItemRef : null}
            onMouseDown={handleItemClick(item)}>
            {item.highlighted || item.name}
          </span>
        ))}
      </div>}
    </div>
  );
}
