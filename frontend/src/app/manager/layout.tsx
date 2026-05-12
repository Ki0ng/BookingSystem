'use client';

import { useAuth } from '@/features/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Hotel, 
  BedDouble, 
  CalendarCheck, 
  Settings, 
  LogOut,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Skeleton } from '@/shared/components/ui/Skeleton';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Skip protection check for the application page
    if (pathname === '/manager/apply') return;

    if (!loading && (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN'))) {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  // If loading, we still show the layout structure with skeletons to avoid flickering

  if (pathname === '/manager/apply') return children;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/manager/dashboard' },
    { name: 'My Hotels', icon: Hotel, href: '/manager/hotels' },
    { name: 'Room Management', icon: BedDouble, href: '/manager/rooms' },
    { name: 'Bookings', icon: CalendarCheck, href: '/manager/bookings' },
    { name: 'Reviews', icon: MessageSquare, href: '/manager/reviews' },
    { name: 'Settings', icon: Settings, href: '/manager/settings' },
  ];

  // If not loading and no user or wrong role, the useEffect will handle the redirect
  // But we return null here to avoid rendering anything private
  if (!loading && (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN'))) return null;


  return (
    <div className="min-h-screen bg-[#FDFDFD] flex transition-all duration-500">
      {/* Sidebar - Elite Professional White Collapsible */}
      <aside className={`bg-white flex flex-col fixed h-full z-50 border-r border-slate-100 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'w-24' : 'w-72'}`}>
        {/* Integrated Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-10 w-7 h-7 bg-white text-slate-400 hover:text-blue-600 rounded-full flex items-center justify-center shadow-md border border-slate-100 transition-all z-50"
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-700 ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>

        <div className={`p-8 mb-4 transition-all duration-500 ${isCollapsed ? 'px-6' : ''}`}>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-100 group-hover:scale-110 transition-all duration-500 shrink-0">
              <Hotel className="text-white w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-700">
                <span className="text-xl font-black tracking-tighter text-slate-900 block leading-none">ELITE</span>
                <span className="text-[8px] font-black text-blue-600 tracking-[0.4em] uppercase leading-none mt-1">Management</span>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          <p className={`px-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            {!isCollapsed && 'Operations'}
          </p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                title={isCollapsed ? item.name : ''}
                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-500 group relative ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={`w-4 h-4 transition-all duration-500 shrink-0 ${isActive ? 'text-white' : 'group-hover:scale-110 group-hover:text-blue-600'}`} />
                  {!isCollapsed && (
                    <span className="text-[11px] font-black tracking-widest uppercase animate-in fade-in slide-in-from-left-2 duration-700 whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </div>
                {!isCollapsed && isActive && (
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={`p-6 mt-auto transition-all duration-500 ${isCollapsed ? 'px-4' : ''}`}>
          <div className={`bg-slate-50 border border-slate-100 rounded-3xl space-y-5 transition-all duration-500 ${isCollapsed ? 'p-3' : 'p-5'}`}>
            <div className="flex items-center gap-3">
              {loading ? (
                <Skeleton className="w-10 h-10 rounded-xl" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 font-black text-sm shadow-sm shrink-0 overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0]
                  )}
                </div>
              )}
              {!isCollapsed && (
                <div className="min-w-0 animate-in fade-in slide-in-from-left-2 duration-700 flex-1">
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-2 w-12" />
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-black text-slate-900 truncate">{user?.name}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Status</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={logout}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 bg-white hover:bg-rose-500 hover:text-white text-slate-400 border border-slate-200 rounded-xl transition-all duration-500 font-black text-[9px] uppercase tracking-[0.2em] shadow-sm ${isCollapsed ? 'p-3' : 'py-3'}`}
            >
              <LogOut className="w-3.5 h-3.5" />
              {!isCollapsed && 'Termination'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 h-screen overflow-y-auto relative transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'ml-24' : 'ml-72'}`}>
        <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-blue-50/30 to-transparent -z-10" />
        
        <div className="p-10">
          <header className="flex items-end justify-between mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div>
              <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-3">Manager Command</p>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                {menuItems.find(item => pathname === item.href)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" target="_blank">
                <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 shadow-sm">
                  View Site
                </Button>
              </Link>
              <Link href="/manager/hotels/new">
                <Button variant="premium" className="h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-blue-200/50">
                  Add Property
                </Button>
              </Link>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
