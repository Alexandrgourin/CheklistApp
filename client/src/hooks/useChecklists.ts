import { useState, useEffect } from 'react';
import { Checklist } from '../types/checklist';
import { api } from '../utils/api';

export const useChecklists = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChecklists = async () => {
    try {
      const response = await api.get('/checklist');
      setChecklists(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching checklists:', err);
      setError('Failed to fetch checklists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const createChecklist = async (checklist: Partial<Checklist>) => {
    try {
      const response = await api.post('/checklist', checklist);
      setChecklists(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating checklist:', err);
      throw err;
    }
  };

  const deleteChecklist = async (id: string) => {
    try {
      await api.delete(`/checklist/${id}`);
      setChecklists(prev => prev.filter(checklist => checklist.id !== id));
    } catch (err) {
      console.error('Error deleting checklist:', err);
      throw err;
    }
  };

  return { 
    checklists, 
    loading, 
    error, 
    createChecklist, 
    deleteChecklist,
    refetch: fetchChecklists 
  };
};
