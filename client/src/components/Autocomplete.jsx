import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';

function AutocompleteInput({ value = '', items = [], onChange = () => { }, ...other }) {
  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onChange(value);

    if (value) {
      const filtered = items.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setIsDropdownVisible(true);
      setHighlightedIndex(-1);
    } else {
      setFilteredSuggestions([]);
      setIsDropdownVisible(false);
    }
  };

  const handleMouseDownInput = () => {
    if (inputValue) {
      const filtered = items.filter(item =>
        item.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setIsDropdownVisible(filtered.length > 0);
      setHighlightedIndex(-1);
    }
  };

  const handleKeyDown = (e) => {

    if (e.ctrlKey && e.key === ' ') {
      e.preventDefault();
      const filtered = items.filter(item =>
        item.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setIsDropdownVisible(filtered.length > 0);
      setHighlightedIndex(-1);
    }
    else if (e.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) =>
        Math.min(prevIndex + 1, filteredSuggestions.length - 1)
      );
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) =>
        Math.max(prevIndex - 1, 0)
      );
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0) {
        handleSuggestionClick(filteredSuggestions[highlightedIndex]);
        e.preventDefault();
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setFilteredSuggestions([]);
    setIsDropdownVisible(false);
    setHighlightedIndex(-1);
  };

  const handleSuggestionMouseDown = (e) => {
    e.preventDefault();
    handleSuggestionClick(e.target.innerText);
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (dropdownRef.current && highlightedIndex >= 0) {
      const highlightedElement = dropdownRef.current.children[highlightedIndex];
      if (highlightedElement) {
        // Cuộn item vào giữa dropdown
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const highlightedRect = highlightedElement.getBoundingClientRect();

        // Điều chỉnh cuộn cho item
        const offset = highlightedRect.top - dropdownRect.top;
        if (offset < 0) {
          dropdownRef.current.scrollTop += offset - 5; // Cuộn lên một chút
        } else if (offset + highlightedRect.height > dropdownRect.height) {
          dropdownRef.current.scrollTop += offset + highlightedRect.height - dropdownRect.height + 5; // Cuộn xuống một chút
        }
      }
    }
  }, [highlightedIndex]);

  // useEffect(() => {
  //   if (dropdownRef.current && highlightedIndex >= 0) {
  //     const highlightedElement = dropdownRef.current.children[highlightedIndex];
  //     if (highlightedElement) {
  //       highlightedElement.scrollIntoView({ block: 'nearest' });
  //     }
  //   }
  // }, [highlightedIndex]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <Input
        className='mt-10 font-inter custom-input'
        autoComplete='off'
        {...other}
        value={inputValue}
        onChange={handleInputChange}
        onMouseDown={handleMouseDownInput}
        onKeyDown={handleKeyDown}
      />
      {isDropdownVisible && filteredSuggestions.length > 0 && (
        <ul className='autocomplete scroll' ref={dropdownRef}>
          {filteredSuggestions.map((suggestion, index) => (
            <li className='autocomplete-item fw-400'
              key={index}
              onMouseDown={handleSuggestionMouseDown}
              style={{
                backgroundColor: highlightedIndex === index ? '#505050' : '',
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteInput;
