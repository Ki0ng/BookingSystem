'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  X,
  Hotel,
  ChevronDown,
  Briefcase,
  Bell,
} from 'lucide-react';

import { Button } from '@/shared/components/ui/Button';
import { useAuth } from '@features/auth';
import { useNotifications } from '@/shared/hooks/useNotifications';
import { useNavbar } from '@/shared/hooks/useNavbar';
import { NotificationPopover } from './navbar/NotificationPopover';
import { UserMenu } from './navbar/UserMenu';

const NAV_ITEMS = [
  { name: 'Hotels', href: '/hotels' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Exclusive Offers', href: '/exclusive-offers' },
  { name: 'Support', href: '/support' },
];

export const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const { 
    isOpen, setIsOpen,
    showUserMenu, setShowUserMenu,
    showNotifications, setShowNotifications,
    isSpecialPage,
    isNavScrolled
  } = useNavbar();

  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications(user?.id);

  const notificationRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowNotifications, setShowUserMenu]);

  if (isSpecialPage) return null;

  const navClass = isNavScrolled
    ? 'py-3 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm'
    : 'py-6 bg-transparent';

  const linkClass = isNavScrolled
    ? 'text-slate-600 hover:text-blue-600'
    : 'text-white/80 hover:text-white';

  const logoClass = isNavScrolled
    ? 'bg-blue-600 shadow-blue-200 shadow-lg'
    : 'bg-white/10 backdrop-blur-md border border-white/20';

  const logoTextClass = isNavScrolled ? 'text-slate-900' : 'text-white';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navClass}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${logoClass}`}>
            <Hotel className="w-6 h-6 text-white" />
          </div>
          <span className={`text-xl font-black tracking-tighter uppercase transition-colors duration-500 ${logoTextClass}`}>
            Elite<span className="text-blue-500">Booking</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link key={item.name} href={item.href} className={`text-sm font-bold tracking-wide uppercase transition-colors ${linkClass}`}>
                {item.name}
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200/20" />

          <div className="flex items-center gap-4">
            {!loading && (!user || user.role === 'USER') && (
              <Link href="/manager/apply">
                <button className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  isNavScrolled ? 'bg-slate-900 text-white hover:bg-blue-600' : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'
                }`}>
                  <Briefcase className="w-3.5 h-3.5" />
                  Become a Partner
                </button>
              </Link>
            )}

            {user && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-xl transition-all ${isNavScrolled ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-white'}`}
                >
                  <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-pulse text-blue-600' : ''}`} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <NotificationPopover 
                    notifications={notifications} 
                    onMarkRead={markAsRead} 
                    onMarkAllRead={markAllAsRead} 
                  />
                )}
              </div>
            )}

            {loading ? (
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-3 p-1.5 rounded-full border transition-all ${isNavScrolled ? 'border-slate-200 bg-slate-50' : 'border-white/20 bg-white/10'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden relative">
                    {user.avatar ? (
                      <Image 
                        src={user.avatar} 
                        fill
                        className="object-cover" 
                        alt={user.name || 'User Avatar'} 
                        sizes="32px"
                        onError={() => {
                          // Nếu ảnh lỗi, chúng ta có thể xóa avatar để nó hiển thị chữ cái đầu
                          console.log("Avatar failed to load, falling back to initial");
                        }}
                      />
                    ) : (user.name?.[0] || 'U')}
                  </div>
                  <ChevronDown className={`w-4 h-4 mr-2 ${isNavScrolled ? 'text-slate-400' : 'text-white/60'}`} />
                </button>
                {showUserMenu && <UserMenu user={user} onLogout={logout} />}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className={`text-xs font-black uppercase tracking-widest transition-colors ${linkClass}`}>Sign In</Link>
                <Link href="/register">
                  <Button className={`rounded-full px-8 h-11 text-xs font-black uppercase tracking-widest ${isNavScrolled ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white text-slate-900 hover:bg-blue-50'}`}>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <button className={`md:hidden p-2 ${isNavScrolled ? 'text-slate-900' : 'text-white'}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </nav>
  );
};
