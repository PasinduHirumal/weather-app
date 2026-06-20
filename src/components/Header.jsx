import React, { useState, useEffect } from 'react';
import { Search, Bell, MapPin, Navigation, Menu } from 'lucide-react';
import avatarImg from '../assets/avatar.png';

export default function Header({ onSelectLocation, location, onUseCurrentLocation, onToggleSidebar, sidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced geocoding search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.results) {
            setSuggestions(data.results);
          } else {
            setSuggestions([]);
          }
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    const formatted = {
      name: suggestion.name,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      country: suggestion.country || ''
    };
    onSelectLocation(formatted);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full mb-8">
      {/* Profile Greeting Section */}
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2.5 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 shadow-sm transition-all duration-300 flex lg:hidden"
          title="Toggle Sidebar"
        >
          <Menu size={18} className="stroke-[2.2] text-orange-500" />
        </button>

        <img
          src={avatarImg}
          alt="Jack Grealish"
          className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm"
        />
        <div>
          <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Hello,</span>
          <h2 className="text-slate-800 text-xl font-bold leading-tight">Jack Grealish</h2>
        </div>
      </div>

      {/* Search and Notification Section */}
      <div className="flex items-center gap-3 w-full sm:w-auto relative">
        <div className="relative flex-1 sm:flex-none">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
            placeholder="Search city..."
            className="w-full sm:w-64 pl-5 pr-11 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/70 placeholder:text-slate-400 transition-all duration-300"
          />
          <Search
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none stroke-[2.5]"
          />

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && (searchQuery.trim().length >= 2 || suggestions.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-[999] animate-fadeIn">
              <div className="py-1">
                {/* Geolocation Button */}
                <button
                  type="button"
                  onClick={() => {
                    onUseCurrentLocation();
                    setShowSuggestions(false);
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-orange-500 hover:bg-orange-50 flex items-center gap-2 border-b border-slate-50 transition-colors"
                >
                  <Navigation size={12} className="fill-orange-500" />
                  Use Current Location
                </button>

                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex flex-col transition-colors"
                    >
                      <span className="text-sm font-bold text-slate-700">{suggestion.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        {suggestion.admin1 ? `${suggestion.admin1}, ` : ''}{suggestion.country}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs font-semibold text-slate-400 text-center">
                    No cities found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={onUseCurrentLocation}
          title="Use my current location"
          className="relative p-2.5 rounded-full border border-slate-100 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 shadow-sm transition-all duration-300 group"
        >
          <MapPin size={18} className="stroke-[2.2] group-hover:scale-110 transition-transform duration-300 text-orange-500" />
        </button>
      </div>
    </header>
  );
}
