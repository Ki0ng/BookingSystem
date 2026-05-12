import React from 'react';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/shared/types';

interface NotificationPopoverProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationPopover = ({ notifications, onMarkRead, onMarkAllRead }: NotificationPopoverProps) => {
  return (
    <div className="absolute right-0 mt-4 w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Notifications</h4>
        <button 
          onClick={onMarkAllRead}
          className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
        >
          Mark all as read
        </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-8 h-8 text-slate-200 mx-auto mb-4" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => onMarkRead(n.id)}
                className={`p-6 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.isRead ? 'bg-blue-50/30' : ''}`}
              >
                {!n.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                <p className={`text-sm font-black mb-1 ${!n.isRead ? 'text-slate-900' : 'text-slate-500'}`}>{n.title}</p>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{n.message}</p>
                <p className="text-[9px] text-slate-300 font-black uppercase mt-3 tracking-widest">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
