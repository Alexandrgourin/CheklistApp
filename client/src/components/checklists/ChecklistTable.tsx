import React, { useState } from 'react';
import { Checklist } from '../../types/checklist';
import { ChecklistTableHeader } from './ChecklistTableHeader';
import { ChecklistTableRow } from './ChecklistTableRow';

interface ChecklistTableProps {
  checklists: Checklist[];
  onChecklistOpen: (id: string) => void;
  onChecklistDelete: (id: string) => void;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export const ChecklistTable: React.FC<ChecklistTableProps> = ({
  checklists,
  onChecklistOpen,
  onChecklistDelete,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' });

  const handleSort = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      setSortConfig({ key, direction: 'asc' });
    } else if (sortConfig.direction === 'asc') {
      setSortConfig({ key, direction: 'desc' });
    } else {
      setSortConfig({ key: 'createdAt', direction: 'desc' }); // Reset to default sort
    }
  };

  const getSortedChecklists = () => {
    console.log('Original checklists:', checklists);
    // Фильтруем только чек-листы с валидным id
    const validChecklists = checklists.filter(checklist => 
      checklist && typeof checklist.id === 'string' && checklist.id.length > 0
    );
    
    return [...validChecklists].sort((a, b) => {
      if (sortConfig.key === 'createdAt') {
        const aDate = new Date(a.createdAt || 0).getTime();
        const bDate = new Date(b.createdAt || 0).getTime();
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }

      const aValue = a[sortConfig.key as keyof Checklist];
      const bValue = b[sortConfig.key as keyof Checklist];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedChecklists = getSortedChecklists();
  console.log('Sorted checklists:', sortedChecklists);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <ChecklistTableHeader onSort={handleSort} sortConfig={sortConfig} />
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedChecklists.map((checklist) => (
            <ChecklistTableRow
              key={`checklist-${checklist.id}`}
              checklist={checklist}
              onDelete={onChecklistDelete}
              onOpen={onChecklistOpen}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
