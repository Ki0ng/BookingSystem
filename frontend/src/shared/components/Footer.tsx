'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUpRight, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { PlatformFeedbackModal } from './PlatformFeedbackModal';
import { useAuth } from '@features/auth';

export const Footer = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const noFooterPaths = ['/login', '/register', '/login-success', '/forgot-password', '/manager/apply'];
  
  if (noFooterPaths.includes(pathname)) return null;

  return (
    <footer className="bg-gray-900 text-gray-300 pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand & Mission */}
          <div className="space-y-8">
            <Link href="/" className="text-2xl font-bold text-white tracking-tighter">
              ELITE<span className="text-blue-500">BOOKING</span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-xs">
              Defining the future of luxury travel. We provide the most exclusive collection of stays for the modern adventurer.
            </p>
            <div className="flex space-x-5">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs">Explore</h4>
            <ul className="space-y-4">
              {['About Us', 'Featured Hotels', 'Destinations', 'Exclusive Deals', 'Travel Blog'].map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-blue-400 flex items-center group transition-colors">
                    {link} <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-8">
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs">Support</h4>
            <ul className="space-y-4">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'Cancellation Policy'].map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-blue-400 transition-colors">{link}</Link>
                </li>
              ))}
              {user && (
                <li>
                  <button 
                    onClick={() => setIsFeedbackOpen(true)}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    Share Feedback <MessageSquare className="w-3 h-3" />
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-sm">123 Luxury Ave, Suite 500<br />New York, NY 10001</p>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-sm">+1 (888) ELITE-B</p>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-sm">concierge@elitebooking.com</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-sm">
          <p className="text-gray-500">&copy; 2024 Elite Booking System. All rights reserved.</p>
          <div className="flex items-center space-x-8">
            <Link href="/manager/apply" className="text-blue-500 font-bold hover:underline">List your property</Link>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-bold">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full" />

      {/* Feedback Modal */}
      <PlatformFeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </footer>
  );
};
