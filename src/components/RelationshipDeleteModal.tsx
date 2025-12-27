// src/components/RelationshipDeleteModal.tsx

'use client';

import React from 'react';

interface RelationshipDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  relationshipType: string;
}

const RelationshipDeleteModal: React.FC<RelationshipDeleteModalProps> = ({ isOpen, onClose, onDelete, relationshipType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Delete Relationship</h2>
        <p>Are you sure you want to delete the relationship "{relationshipType}"?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={onDelete} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default RelationshipDeleteModal;