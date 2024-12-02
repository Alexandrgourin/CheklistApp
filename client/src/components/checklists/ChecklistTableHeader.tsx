import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface ChecklistTableHeaderProps {
  sortConfig: SortConfig;
  onSort: (key: string) => void;
}

export const ChecklistTableHeader: React.FC<ChecklistTableHeaderProps> = ({
  sortConfig,
  onSort,
}) => {
  const headers = [
    { key: 'title', label: 'Название' },
    { key: 'shortName', label: 'Краткое название' },
    { key: 'status', label: 'Статус' },
    { key: 'createdAt', label: 'Создан' },
    { key: 'updatedAt', label: 'Обновлен' },
  ];

  const getSortIcon = (key: string) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? (
        <FiArrowUp className="w-4 h-4 ml-1" />
      ) : (
        <FiArrowDown className="w-4 h-4 ml-1" />
      );
    }
    return null;
  };

  return (
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        {headers.map((header) => (
          <th
            key={header.key}
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            onClick={() => onSort(header.key)}
          >
            <div className="flex items-center">
              {header.label}
              {getSortIcon(header.key)}
            </div>
          </th>
        ))}
        <th scope="col" className="relative px-6 py-3">
          <span className="sr-only">Действия</span>
        </th>
      </tr>
    </thead>
  );
};
