'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: MessageCircle, label: 'Chat Support', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Phone, label: 'Call Us', color: 'bg-green-500 hover:bg-green-600' },
    { icon: Mail, label: 'Email', color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: HelpCircle, label: 'Help', color: 'bg-orange-500 hover:bg-orange-600' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      <div className={`flex flex-col space-y-3 mb-3 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 transform transition-all duration-300 ${
              isOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group border-2 border-white dark:border-gray-800"
          >
            <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap">
              {action.label}
            </span>
            <Button
              className="w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group border-2 border-white dark:border-gray-800"
              className={`${action.color} text-white shadow-lg hover:scale-110 transition-all duration-300 w-12 h-12 rounded-full`}
            >
              <action.icon className="w-5 h-5" />
            </Button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </Button>
    </div>
  );
}