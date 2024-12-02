import React from 'react';
import { Modal } from '../common/Modal'; // Adjust the import path as needed

interface CreateChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (checklist: { title: string; shortName: string }) => void;
}

export const CreateChecklistModal: React.FC<CreateChecklistModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate 
}) => {
  const [title, setTitle] = React.useState('');
  const [shortName, setShortName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && shortName) {
      onCreate({ title, shortName });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <h2>Create New Checklist</h2>
        <input
          type="text"
          placeholder="Checklist Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Short Name"
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
          required
        />
        <div>
          <button type="submit">Create</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};
