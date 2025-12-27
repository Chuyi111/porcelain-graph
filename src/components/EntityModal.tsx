// src/components/EntityModal.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Entity, EntityType } from '@/types/graph';
import { updateEntity } from '@/lib/graphStorage';

interface EntityModalProps {
  entity: Entity | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const entityTypes: EntityType[] = [
  'Porcelain', 'Technique', 'Material', 'Shape', 'Glaze', 'Pattern', 'Kiln', 'Period', 'Source', 'Image'
];

const EntityModal: React.FC<EntityModalProps> = ({ entity, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<Partial<Entity>>({});

  useEffect(() => {
    if (entity) {
      setFormData(entity);
    }
  }, [entity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entity && formData.name && formData.type) {
      updateEntity(entity.id, formData);
      onUpdate();
      onClose();
    }
  };

  if (!isOpen || !entity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Entity</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={formData.type || ''}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as EntityType })}
              className="w-full p-2 border rounded"
            >
              {entityTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntityModal;