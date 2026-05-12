'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isManagerPage = pathname.startsWith('/manager') && pathname !== '/manager/apply';
  const isAdminPage = pathname.startsWith('/admin');
  const isAuthPage = ['/login', '/register', '/login-success', '/forgot-password', '/reset-password'].includes(pathname);
  
  const hasNavbar = !isManagerPage && !isAdminPage && !isAuthPage;
  
  // Don't add padding for home page (hero covers it) or pages without navbar
  const isHomePage = pathname === '/';
  const shouldAddPadding = hasNavbar && !isHomePage;

  return (
    <>
      <main className={shouldAddPadding ? 'pt-24' : ''}>
        {children}
      </main>
      {!isManagerPage && !isAdminPage && <Footer />}
    </>
  );
};
