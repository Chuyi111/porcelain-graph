// src/components/RelationshipModal.tsx

'use client';

import React, { useState } from 'react';
import { RelationshipType } from '@/types/graph';

interface RelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (type: RelationshipType, notes?: string) => void;
}

const relationshipTypes: RelationshipType[] = [
  'HAS_TECHNIQUE', 'HAS_GLAZE', 'HAS_PATTERN', 'MADE_AT', 'DATED_TO', 'MENTIONED_IN', 'PHOTOED'
];

const RelationshipModal: React.FC<RelationshipModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [selectedType, setSelectedType] = useState<RelationshipType>('HAS_TECHNIQUE');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(selectedType, notes);
    onClose();
    setNotes('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Select Relationship Type</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as RelationshipType)}
              className="w-full p-2 border rounded"
            >
              {relationshipTypes.map((type) => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RelationshipModal;