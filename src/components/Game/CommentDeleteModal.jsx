import React from 'react';

const CommentDeleteModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-800/50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl p-6 w-96 border border-gray-700 shadow-2xl">
        <h2 className="text-lg font-bold mb-2 text-gray-200">Eliminazione commento!</h2>
        <p className="text-gray-400">Sei sicuro di voler eliminare questo commento?</p>
        <p className="text-gray-400 mb-4">Questa azione è irreversibile.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 text-sm text-gray-200 transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2 text-sm text-white transition-colors"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentDeleteModal;