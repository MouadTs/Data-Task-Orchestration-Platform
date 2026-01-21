import React, { useState, useRef, useEffect } from 'react';
import './MultiSelectDropdown.css';

const MultiSelectDropdown = ({ options, value, onChange, placeholder = "Select options..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange({ target: { value: newValue } });
  };

  const selectedLabels = options
    .filter(opt => value.includes(opt.value))
    .map(opt => opt.label);

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <div 
        className="multi-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedLabels.length === 0 ? 'placeholder' : ''}>
          {selectedLabels.length === 0 
            ? placeholder 
            : selectedLabels.length === 1 
              ? selectedLabels[0]
              : `${selectedLabels.length} selected`
          }
        </span>
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {isOpen && (
        <div className="multi-select-options">
          {options.map((option) => (
            <div
              key={option.value}
              className={`multi-select-option ${value.includes(option.value) ? 'selected' : ''}`}
              onClick={() => toggleOption(option.value)}
            >
              <div className="option-checkbox">
                {value.includes(option.value) && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
