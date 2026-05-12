'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const useNavbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSpecialPage = () => {
    const path = pathname || '';
    const hiddenPaths = ['/login', '/register', '/login-success', '/forgot-password', '/reset-password'];
    return hiddenPaths.includes(path) || (path.startsWith('/manager') && path !== '/manager/apply') || path.startsWith('/admin');
  };

  const isHomePage = pathname === '/';
  const isNavScrolled = scrolled || !isHomePage;

  return {
    isOpen, setIsOpen,
    scrolled,
    showUserMenu, setShowUserMenu,
    showNotifications, setShowNotifications,
    isSpecialPage: isSpecialPage(),
    isNavScrolled,
    pathname
  };
};
