import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../../services/auth.service';
import { api } from '../../utils/api';
import { startOfDay } from 'date-fns';
import { DashboardCard } from './DashboardCard';
import { RecentChecklists } from './RecentChecklists';
import { Checklist } from '../../types/checklist';

interface User {
  name: string;
  email: string;
}

interface ChecklistStats {
  total: number;
  todayCount: number;
  activeCount: number;
}

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ChecklistStats>({
    total: 0,
    todayCount: 0,
    activeCount: 0
  });
  const [checklists, setChecklists] = useState<Checklist[]>([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchChecklists();
    
    // Устанавливаем интервал для периодического обновления данных
    const interval = setInterval(fetchChecklists, 30000); // Обновление каждые 30 секунд
    
    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  const fetchChecklists = async () => {
    try {
      const response = await api.get('/checklist');
      // Сортировка по дате создания (новые сверху)
      const sortedChecklists = response.data.sort((a: Checklist, b: Checklist) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setChecklists(sortedChecklists);
      
      // Обновляем статистику при получении новых данных
      const today = startOfDay(new Date());
      const newStats = {
        total: sortedChecklists.length,
        todayCount: sortedChecklists.filter((checklist: Checklist) => 
          new Date(checklist.createdAt) >= today
        ).length,
        activeCount: sortedChecklists.filter((checklist: Checklist) => 
          checklist.status === 'active'
        ).length
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching checklists:', error);
    }
  };

  const cards = [
    {
      id: 'total-checklists',
      title: 'Всего чек-листов',
      value: stats.total,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    {
      id: 'today-checklists',
      title: 'Создано сегодня',
      value: stats.todayCount,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-green-500'
    },
    {
      id: 'active-checklists',
      title: 'Активных',
      value: stats.activeCount,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-500'
    }
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 pt-16 overflow-auto bg-gray-50 dark:bg-gray-900"
    >
      <div className="min-w-full min-h-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto mb-8">
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              Добро пожаловать, {user.name}!
            </motion.h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Вот ваша сводка на сегодня</p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cards.map((card, index) => (
              <DashboardCard
                key={card.id}
                {...card}
                index={index}
              />
            ))}
          </div>

          <RecentChecklists checklists={checklists} />
        </div>
      </div>
    </motion.div>
  );
};
