'use client';

import React from 'react';
import {
  Hotel as HotelIcon,
  Star,
  TrendingUp,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { useManagerDashboard } from '@/features/dashboard';

export default function ManagerDashboard() {
  const { loading, stats, myHotel, revenueData } = useManagerDashboard();

  const statCards = [
    { name: 'Portfolio Growth', label: 'Total Hotels', value: stats.totalHotels, icon: HotelIcon, color: 'from-blue-600 to-blue-400', shadow: 'shadow-blue-200/50' },
    { name: 'Customer Trust', label: 'Average Rating', value: stats.averageRating.toFixed(1), icon: Star, color: 'from-amber-500 to-amber-300', shadow: 'shadow-amber-200/50' },
    { name: 'Guest Feedback', label: 'Pending Reviews', value: stats.pendingReviews, icon: MessageSquare, color: 'from-emerald-600 to-emerald-400', shadow: 'shadow-emerald-200/50' },
    { name: 'Financial Status', label: 'Monthly Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'from-rose-600 to-rose-400', shadow: 'shadow-rose-200/50' },
  ];

  if (loading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="w-20 h-2" />
                <Skeleton className="w-16 h-6 rounded-lg" />
              </div>
              <Skeleton className="w-28 h-3 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Premium Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-bl-[3rem] transition-all duration-700`} />
            <div className="relative z-10">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white transition-all w-fit mb-6 shadow-lg ${stat.shadow} group-hover:scale-110 duration-500`}>
                <stat.icon className="w-5 h-5" />
              </div>
              
              <div className="space-y-1">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">{stat.name}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">{stat.value}</h3>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Dynamics Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-2">Revenue Analytics</p>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Performance Dynamics</h2>
            </div>
            <div className="bg-slate-50 p-1 rounded-lg flex gap-1 border border-slate-100">
              {['7D', '30D', '1Y'].map((t) => (
                <button key={t} className={`px-4 py-2 rounded-md text-[9px] font-bold tracking-widest uppercase transition-all ${t === '7D' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between px-2 gap-4 relative z-10">
            {revenueData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                <div className="relative w-full flex flex-col items-center justify-end h-56">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/bar:translate-y-0 z-20">
                    <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-tight shadow-xl whitespace-nowrap">
                      ${data.revenue.toLocaleString()}
                    </div>
                    <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
                  </div>
                  
                  {/* The Bar */}
                  <div 
                    className="w-full max-w-[28px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out group-hover/bar:from-blue-500 relative overflow-hidden"
                    style={{ height: `${Math.max(data.percentage, 5)}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_100%] animate-shimmer" />
                  </div>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Card */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl flex flex-col justify-between h-full group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-600/20 transition-all duration-1000" />
            
            <div className="space-y-8 relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-inner">
                <HotelIcon className="w-6 h-6 text-blue-400" />
              </div>
              
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight leading-tight">
                  {myHotel ? `Master your ${myHotel.name} portfolio` : 'Initialize Elite Partnership'}
                </h3>
                <p className="text-slate-400 text-[13px] mt-4 font-medium leading-relaxed">
                  {myHotel ? 'Optimizing your hospitality ecosystem. Expand categories and manage inventory.' : 'The portal to luxury management awaits. Join the most prestigious network.'}
                </p>
              </div>

              <Link href={myHotel ? `/manager/hotels` : "/manager/hotels/new"} className="block">
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-500 h-12 rounded-xl font-bold flex items-center justify-between px-6 shadow-2xl shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <span className="uppercase tracking-widest text-[9px]">{myHotel ? 'Control Panel' : 'Register Now'}</span>
                  <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
