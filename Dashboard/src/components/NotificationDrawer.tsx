import React from 'react';
import { Bell, X, AlertTriangle, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: 'Low Stock Threshold Reached',
      time: '10 mins ago',
      desc: 'Cold Brewed Iced Coffee stock (18 units) fell below safety buffer (50 units).',
      type: 'warning'
    },
    {
      id: 'n2',
      title: 'AI Vision POS Guard Blocked Item',
      time: '25 mins ago',
      desc: 'Cheddar Cheese Block (Batch D4) was auto-blocked at Counter #04 due to expired barcode.',
      type: 'danger'
    },
    {
      id: 'n3',
      title: 'Upcoming Expiry Warning',
      time: '1 hour ago',
      desc: '12 units of Greek Vanilla Yogurt expire tomorrow. 30% clearance discount recommended.',
      type: 'warning'
    },
    {
      id: 'n4',
      title: 'Peak Evening Traffic Window',
      time: '2 hours ago',
      desc: 'Predicted peak volume starts at 17:00. Open 2 additional cash counters.',
      type: 'info'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm h-full glass-panel border-l shadow-2xl p-5 flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-500" />
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">System Alerts</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="py-4 space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="p-3 rounded-xl glass-card border text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900 dark:text-white">{n.title}</span>
                  <span className="text-[10px] text-gray-400">{n.time}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-xs hover:bg-indigo-600 transition-all text-center"
        >
          Mark All As Read
        </button>

      </div>
    </div>
  );
};
