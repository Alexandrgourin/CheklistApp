import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EllipsisVerticalIcon, TrashIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface ChecklistRowMenuProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDelete: () => void;
  onOpen2: () => void;
}

export const ChecklistRowMenu: React.FC<ChecklistRowMenuProps> = ({
  isOpen,
  onOpen,
  onClose,
  onDelete,
  onOpen2
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleMenuClick}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ duration: 0.1 }}
            className="fixed transform -translate-x-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[100]"
          >
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen2();
                  onClose();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-3" />
                Открыть
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  onClose();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-3" />
                Удалить
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
