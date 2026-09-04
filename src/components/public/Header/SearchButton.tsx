import React from 'react';
import { Search } from 'lucide-react';

export interface SearchButtonProps {
  onClick: () => void;
  className?: string;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      type="button"
      className={`flow-header-search-btn ${className}`}
      onClick={onClick}
      aria-label="Pesquisar no Flow"
    >
      <Search size={19} />
    </button>
  );
};

export default SearchButton;
