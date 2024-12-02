import { Checklist } from '../../types/checklist';

interface RecentChecklistsProps {
  checklists: Checklist[];
}

export const RecentChecklists = ({ checklists }: RecentChecklistsProps) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Последние чек-листы</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {checklists?.slice(0, 5).map((checklist: Checklist) => (
            <div key={checklist.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{checklist.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Создан: {new Date(checklist.createdAt).toLocaleString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  checklist.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  checklist.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {checklist.status === 'active' ? 'Активный' :
                   checklist.status === 'completed' ? 'Завершен' :
                   'Архив'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
