'use client';

import {
  Users,
  Hotel,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAdminDashboard } from '@/features/dashboard';
import { Skeleton } from '@/shared/components/ui/Skeleton';

export default function AdminDashboard() {
  const { stats, loading } = useAdminDashboard();

  const adminStats = [
    { name: 'Global Users', value: stats.totalUsers, icon: Users, color: 'blue', trend: '+124 today' },
    { name: 'Verified Hotels', value: stats.totalHotels, icon: Hotel, color: 'indigo', trend: '+8 this week' },
    { name: 'Pending Applications', value: stats.pendingApps, icon: ShieldAlert, color: 'amber', trend: 'Priority Action' },
    { name: 'System Status', value: stats.systemHealth, icon: Activity, color: 'emerald', trend: 'All systems green' },
  ];

  if (loading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm space-y-4">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-12 h-8" />
              </div>
              <Skeleton className="w-24 h-4 rounded-full" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 h-96 bg-white rounded-[3rem] border border-slate-50 p-10">
            <Skeleton className="w-full h-full rounded-2xl" />
          </div>
          <div className="h-96 bg-slate-900 rounded-[3rem] p-10">
            <Skeleton className="w-full h-full rounded-2xl opacity-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {adminStats.map((stat) => (
          <div key={stat.name} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:bg-blue-50 transition-colors" />
            <div className="relative z-10">
              <div className="p-4 rounded-2xl bg-slate-50 text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 w-fit mb-6">
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.name}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{stat.value}</h3>
              <p className={`text-[10px] font-black mt-4 flex items-center gap-1 ${stat.color === 'amber' ? 'text-rose-500' : 'text-emerald-500'}`}>
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent System Activity */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-slate-900">Platform Traffic</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">Live Analytics</span>
            </div>
          </div>
          <div className="h-80 flex items-end justify-between gap-6 px-4">
            {[60, 45, 80, 50, 90, 70, 85, 65, 95, 75].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4">
                <div
                  className="w-full bg-slate-100 rounded-2xl transition-all duration-700 hover:bg-blue-600 cursor-pointer relative group"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{i + 1}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Overview */}
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-blue-900/40 space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-black">Security Audit</h3>
            <p className="text-slate-400 text-sm font-medium">Monitoring platform integrity.</p>
          </div>

          <div className="space-y-4">
            {[
              { label: 'SSL Encryption', status: 'Active', icon: CheckCircle2, color: 'text-emerald-400' },
              { label: 'Database Integrity', status: 'Optimal', icon: CheckCircle2, color: 'text-emerald-400' },
              { label: 'Pending Updates', status: '0 Available', icon: Clock, color: 'text-blue-400' },
              { label: 'Login Attempts', status: 'Normal', icon: Activity, color: 'text-blue-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-xs font-bold">{item.label}</span>
                </div>
                <span className="text-[10px] font-black uppercase text-slate-500">{item.status}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5">
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-900/20">
              Run System Diagnostic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
