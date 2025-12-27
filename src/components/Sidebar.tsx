// src/components/Sidebar.tsx

'use client';

import React, { useState } from 'react';
import { EntityType } from '@/types/graph';

interface SidebarProps {
  onSearch: (query: string) => void;
  onFilter: (types: EntityType[]) => void;
  selectedTypes: EntityType[];
  onShowAll: () => void;
  onExport: () => void;
  onImport: (data: any) => void;
}

const entityTypes: EntityType[] = [
  'Porcelain', 'Technique', 'Material', 'Shape', 'Glaze', 'Pattern', 'Kiln', 'Period', 'Source', 'Image'
];

const Sidebar: React.FC<SidebarProps> = ({ onSearch, onFilter, selectedTypes, onShowAll, onExport, onImport }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleTypeChange = (type: EntityType, checked: boolean) => {
    const newSelected = checked
      ? [...selectedTypes, type]
      : selectedTypes.filter(t => t !== type);
    onFilter(newSelected);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          onImport(data);
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-64 bg-gray-100 p-4 border-r border-gray-300">
      <h2 className="text-lg font-bold mb-4">Search & Filter</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Search</label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search entities..."
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Entity Types</label>
        {entityTypes.map((type) => (
          <div key={type} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={type}
              checked={selectedTypes.includes(type)}
              onChange={(e) => handleTypeChange(type, e.target.checked)}
              className="mr-2"
            />
            <label htmlFor={type} className="text-sm">{type}</label>
          </div>
        ))}
      </div>
      <button
        onClick={onShowAll}
        className="w-full bg-blue-500 text-white py-2 rounded mb-2"
      >
        Show All
      </button>
      <button
        onClick={onExport}
        className="w-full bg-green-500 text-white py-2 rounded mb-2"
      >
        Export Data
      </button>
      <label className="w-full bg-yellow-500 text-white py-2 rounded cursor-pointer block text-center">
        Import Data
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default Sidebar;