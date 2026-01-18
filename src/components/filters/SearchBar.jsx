import React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * Search Bar Component
 * @param {Object} props
 * @param {string} props.value - Search value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 */
const SearchBar = ({ value, onChange, placeholder = 'Search products...' }) => {
  const [localValue, setLocalValue] = React.useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  // Update parent when debounced value changes
  React.useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  // Sync with external value changes
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
