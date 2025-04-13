'use client';

import React, { useState } from 'react';
import { List, Map, Search } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { VenueList } from './VenueList';
import { VenueMap } from './VenueMap';

export const DiscoverVenues: React.FC = () => {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col pt-10 pb-20 px-6">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold mb-1">Search Venues & Festivals</h1>
        <p className="text-muted-foreground">Access exclusive benefits worldwide</p>
      </div>

      <div className="mb-6 animate-fade-in">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search venues..."
            className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200"
          />
        </div>
      </div>

      <div className="mb-6 flex justify-center space-x-2 animate-fade-in">
        <button
          onClick={() => setView('list')}
          className={`px-4 py-2 rounded-lg flex items-center ${
            view === 'list' 
              ? 'bg-primary text-white' 
              : 'bg-white/50 text-muted-foreground'
          }`}
        >
          <List className="h-4 w-4 mr-2" />
          List
        </button>
        <button
          onClick={() => setView('map')}
          className={`px-4 py-2 rounded-lg flex items-center ${
            view === 'map' 
              ? 'bg-primary text-white' 
              : 'bg-white/50 text-muted-foreground'
          }`}
        >
          <Map className="h-4 w-4 mr-2" />
          Map
        </button>
      </div>

      <div className="animate-fade-in">
        {view === 'list' ? <VenueList searchQuery={searchQuery} /> : <VenueMap searchQuery={searchQuery} />}
      </div>
    </div>
  );
};
