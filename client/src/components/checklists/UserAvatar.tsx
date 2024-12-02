import React from 'react';

interface UserAvatarProps {
  name: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ name }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (name: string) => {
    const colors = [
      'bg-pink-500',
      'bg-purple-500',
      'bg-indigo-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
    ];
    
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getRandomColor(name)}`}
    >
      {getInitials(name)}
    </div>
  );
};
