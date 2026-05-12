'use client';

import { useAuth } from '@/features/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Hotel, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Bell,
  Search
} from 'lucide-react';

import { Skeleton } from '@/shared/components/ui/Skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Pending Approvals', icon: ShieldCheck, href: '/admin/applications' },
    { name: 'User Management', icon: Users, href: '/admin/users' },
    { name: 'Hotel Oversight', icon: Hotel, href: '/admin/hotels' },
    { name: 'System Settings', icon: Settings, href: '/admin/settings' },
  ];

  // If not loading and no user or wrong role, the useEffect will handle the redirect
  if (!loading && (!user || user.role !== 'ADMIN')) return null;


  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 text-white flex flex-col fixed h-full z-30 shadow-2xl">
        <div className="p-10 border-b border-white/5">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50 group-hover:rotate-6 transition-all duration-500">
              <ShieldCheck className="text-white w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tighter block leading-none">ELITE</span>
              <span className="text-[10px] font-black text-blue-400 tracking-[0.4em] uppercase mt-1 block">Control Center</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2 mt-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="text-sm font-bold tracking-wide">{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5 mt-auto bg-black/20">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-rose-600 text-slate-300 hover:text-white rounded-2xl transition-all duration-500 font-bold text-sm"
          >
            <LogOut className="w-4 h-4" />
            Terminal Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-80 flex-1 p-12 overflow-y-auto min-h-screen">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {menuItems.find(item => pathname === item.href)?.name || 'Admin Panel'}
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Elite Booking Network Authority</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                placeholder="Global System Search..." 
                className="pl-12 pr-6 h-12 w-80 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium transition-all"
              />
            </div>
            <button className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm transition-all relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-4 bg-white p-1.5 pr-6 rounded-2xl shadow-sm border border-slate-100">
              {loading ? (
                <Skeleton className="w-9 h-9 rounded-xl" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                  {user?.name?.[0]}
                </div>
              )}
              <div className="hidden sm:block">
                {loading ? (
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-black text-slate-900 leading-none">{user?.name}</p>
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1">Super Admin</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
