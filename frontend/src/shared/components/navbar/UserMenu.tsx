import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, LogOut, Briefcase, User as UserIcon, Calendar } from 'lucide-react';
import { User } from '@/shared/types';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

export const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  return (
    <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 animate-in fade-in zoom-in duration-300">
      <div className="p-4 border-b border-slate-50 mb-2">
        <p className="text-sm font-black text-slate-900">{user.name}</p>
        <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-widest">{user.role}</p>
      </div>

      <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
        <UserIcon className="w-4 h-4" />
        <span className="text-sm font-bold">My Profile</span>
      </Link>

      <Link href="/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-bold">My Bookings</span>
      </Link>

      {user.role === 'ADMIN' && (
        <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 text-purple-600 transition-colors">
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-sm font-bold">Admin Dashboard</span>
        </Link>
      )}

      {(user.role === 'MANAGER' || user.role === 'ADMIN') && (
        <Link href="/manager/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-blue-600 transition-colors">
          <Briefcase className="w-4 h-4" />
          <span className="text-sm font-bold">Manager Dashboard</span>
        </Link>
      )}

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 text-rose-500 transition-colors mt-1"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-bold">Sign Out</span>
      </button>
    </div>
  );
};
