import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  index: number;
}

export const DashboardCard = ({ title, value, icon, color, index }: DashboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-lg p-3 ${color} bg-opacity-10 dark:bg-opacity-20`}>
            <div className="w-6 h-6 text-white">{icon}</div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
