import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { ChecklistTable } from './ChecklistTable';
import { CreateChecklistModal } from './CreateChecklistModal';
import { useChecklists } from '../../hooks/useChecklists';
import { motion, AnimatePresence } from 'framer-motion';
import { Checklist } from '../../types/checklist';

export const ChecklistsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { checklists, loading, error, createChecklist, deleteChecklist } = useChecklists();

  const filteredChecklists: Checklist[] = checklists.filter((checklist: Checklist) =>
    checklist && (
      checklist.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      checklist.shortName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  console.log('All checklists:', checklists);
  console.log('Filtered checklists:', filteredChecklists);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 dark:bg-gray-900 relative mt-16"
    >
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Чек-листы</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <FiPlus className="mr-2 -ml-1 h-4 w-4" />
            Новый чек-лист
          </button>
        </div>
        
        <div className="mt-4 relative">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm transition-colors duration-200"
              placeholder="Поиск чек-листов..."
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-12"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Ошибка при загрузке чек-листов
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              </div>
            </div>
          </motion.div>
        ) : filteredChecklists.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400">Чек-листы не найдены</p>
          </motion.div>
        ) : (
          <ChecklistTable
            checklists={filteredChecklists}
            onChecklistDelete={deleteChecklist}
            onChecklistOpen={(id: string) => {
              navigate(`/checklists/${id}`);
            }}
          />
        )}
      </AnimatePresence>

      <CreateChecklistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={createChecklist}
      />
    </motion.div>
  );
};
