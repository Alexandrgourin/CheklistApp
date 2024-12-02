import React, { useState, useRef } from 'react';
import { FiCamera } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../utils/api';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const [avatar, setAvatar] = useState<string | undefined>(
    user?.avatar ? `${import.meta.env.VITE_API_URL}/uploads/avatars/${user.avatar}` : undefined
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
      setError('Пожалуйста, выберите изображение (JPEG, PNG или GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/user/avatar', formData);
      
      if (response.data && response.data.avatarUrl) {
        const avatarUrl = `${import.meta.env.VITE_API_URL}/uploads/avatars/${response.data.avatarUrl}`;
        setAvatar(avatarUrl);
        updateUser?.({ avatar: response.data.avatarUrl });
      }

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      setError(error.response?.data?.message || 'Ошибка при загрузке изображения');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl leading-6 font-semibold text-gray-900 dark:text-white text-center">
              Профиль пользователя
            </h3>
          </div>

          <div className="px-4 py-8 sm:px-6">
            <div className="flex flex-col items-center space-y-6">
              {/* Avatar Section */}
              <div className="relative">
                <div
                  className={`w-28 h-28 rounded-full overflow-hidden relative cursor-pointer group ring-2 ring-offset-2 ${
                    theme === 'dark' ? 'ring-gray-700 bg-gray-700' : 'ring-gray-200 bg-gray-200'
                  }`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={handleAvatarClick}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Error loading avatar:', e);
                        setAvatar(undefined);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-semibold text-gray-400">
                        {user?.name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <FiCamera className="text-white text-3xl" />
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {/* User Info */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.name || 'Пользователь'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleAvatarClick}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                disabled={isLoading}
              >
                <FiCamera className="mr-2" />
                {isLoading ? 'Загрузка...' : 'Изменить фото'}
              </button>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/20 rounded-md px-4 py-2">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
