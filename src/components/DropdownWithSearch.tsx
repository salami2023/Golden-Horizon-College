import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  avatar?: string;
  icon?: React.ReactNode;
}

interface DropdownWithSearchProps {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  onSearchSubmit?: (query: string) => void;
  className?: string;
  colorScheme?: 'indigo' | 'emerald' | 'blue' | 'purple' | 'amber' | 'slate';
  buttonLabel?: string;
}

export const DropdownWithSearch: React.FC<DropdownWithSearchProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search items...',
  onSearchSubmit,
  className = '',
  colorScheme = 'indigo',
  buttonLabel = 'Search'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (opt.badge && opt.badge.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedOption = options.find((opt) => opt.value === value);

  const colorStyles = {
    indigo: {
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20',
      activeItem: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold',
      border: 'focus:border-indigo-500 focus:ring-indigo-500/20',
      tag: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
    },
    emerald: {
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
      activeItem: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold',
      border: 'focus:border-emerald-500 focus:ring-emerald-500/20',
      tag: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    },
    blue: {
      btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
      activeItem: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold',
      border: 'focus:border-blue-500 focus:ring-blue-500/20',
      tag: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
    },
    purple: {
      btn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20',
      activeItem: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold',
      border: 'focus:border-purple-500 focus:ring-purple-500/20',
      tag: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
    },
    amber: {
      btn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
      activeItem: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold',
      border: 'focus:border-amber-500 focus:ring-amber-500/20',
      tag: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    },
    slate: {
      btn: 'bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 shadow-slate-900/20',
      activeItem: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold',
      border: 'focus:border-slate-500 focus:ring-slate-500/20',
      tag: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
    }
  }[colorScheme];

  const handleSearchClick = () => {
    setIsOpen((prev) => !prev);
    if (onSearchSubmit && searchQuery) {
      onSearchSubmit(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (filteredOptions.length > 0) {
        onChange(filteredOptions[0].value);
        setIsOpen(false);
      }
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-flex flex-col text-xs ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
          {label}
        </label>
      )}

      <div className="flex items-center gap-1.5">
        {/* Dropdown Trigger Box */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="min-w-[180px] max-w-xs sm:max-w-sm flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition shadow-sm select-none"
        >
          <div className="flex items-center gap-2 overflow-hidden truncate">
            {selectedOption?.avatar && (
              <img
                src={selectedOption.avatar}
                alt=""
                className="h-5 w-5 rounded-full object-cover shrink-0"
              />
            )}
            {selectedOption?.icon && (
              <span className="shrink-0 text-slate-500">{selectedOption.icon}</span>
            )}
            <span className="truncate font-semibold text-xs">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 text-slate-400">
            {selectedOption?.badge && (
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${colorStyles.tag}`}>
                {selectedOption.badge}
              </span>
            )}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Search Button beside Dropdown */}
        <button
          type="button"
          onClick={handleSearchClick}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer ${colorStyles.btn}`}
          title="Search or filter options"
        >
          <Search className="h-3.5 w-3.5" />
          <span>{buttonLabel}</span>
        </button>
      </div>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 p-2 space-y-2 animate-in fade-in zoom-in-95 duration-150">
          {/* Search Input Box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto space-y-1 divide-y divide-slate-100/50 dark:divide-slate-800/50">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 font-medium">
                No matching results found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition flex items-center justify-between gap-2 group ${
                      isSelected
                        ? colorStyles.activeItem
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {opt.avatar && (
                        <img
                          src={opt.avatar}
                          alt=""
                          className="h-6 w-6 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                      )}
                      {opt.icon && (
                        <span className="shrink-0 text-slate-500 group-hover:text-indigo-600">
                          {opt.icon}
                        </span>
                      )}
                      <div className="overflow-hidden">
                        <div className="font-semibold truncate text-slate-900 dark:text-slate-100">
                          {opt.label}
                        </div>
                        {opt.sublabel && (
                          <div className="text-[10px] text-slate-400 truncate">
                            {opt.sublabel}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {opt.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${colorStyles.tag}`}>
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
