
import { Check, ChevronsUpDownIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { ButtonOutline } from './Button';
import Popover from './Popover';
import { Input } from './ui/input';

function AutocompleteTag({
  value = [],
  items = [],
  onChange = () => { },
  placeholder,
  placeholderSearch,
  tags = [],
}) {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const filtered = items.filter(item =>
      item?.title?.toLowerCase().includes(inputValue?.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const filtered = items.filter(item =>
      item?.title?.toLowerCase().includes(value?.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  }

  const handleChangeSelectedTag = (tag) => {
    const newValue = value?.includes(tag)
      ? value?.filter((t) => t !== tag)
      : [...value, tag];
    onChange(newValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
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
        handleChangeSelectedTag(filteredSuggestions[highlightedIndex]?.id);
        e.preventDefault();
      }
    }
  };

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

  return (
    <Popover
      modal={true}
      trigger={
        <ButtonTag tags={tags} placeholder={placeholder} />
      }
      content={
        <div ref={wrapperRef} style={{ position: 'relative', height: 223 }} className="p-0">
          <Input
            className='font-inter custom-input-tag'
            autoComplete='off'
            placeholder={`Tìm kiếm ${placeholderSearch} ...`}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          {filteredSuggestions.length > 0 &&
            <ul className='
              autocomplete-tag scroll
              ' ref={dropdownRef}>
              {filteredSuggestions.map((item, index) => (
                <li className='autocomplete-tag-item fw-400 d-flex justify-content-between align-items-center'
                  key={index}
                  onClick={() => handleChangeSelectedTag(item?.id)}
                  style={{
                    backgroundColor: (highlightedIndex === index) ? '#323230' : '',
                  }}
                >
                  <span className="d-flex gap-10 align-items-center">
                    {item?.icon}
                    {item?.title}
                  </span>
                  {value.includes(item?.id) && <Check size={'16px'} />}
                </li>
              ))}
            </ul>
            ||
            <div
              className='font-inter fs-400 mt-21 d-flex justify-center'
            >
              <span>
                {`Không tìm thấy ${placeholderSearch}.`}
              </span>
            </div>
          }
        </div>
      }
    />
  );
}

const ButtonTag = ({ tags = [], placeholder }) => {
  return (
    <div
      style={{ paddingInline: '11.5px' }}
      className='
      mt-10 input-tags pointer flex select-none items-center justify-between w-full font-inter button-tag
      '
    >
      {tags?.length > 0 ?
        <div className='items-center flex gap-6'>
          {tags}
        </div>
        :
        placeholder
      }
      <ChevronsUpDownIcon color="#999998" className="mt-0.5" size={16} />
    </div>
  )
}

export default AutocompleteTag;
