'use client';

import { Mail, Phone, MessageSquare, Search, ChevronRight, HelpCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

export default function SupportPage() {
  const faqs = [
    { q: 'How do I cancel my booking?', a: 'You can cancel your booking through your profile dashboard under the "My Bookings" section. Please review the cancellation policy for your specific hotel.' },
    { q: 'What is the check-in policy?', a: 'Standard check-in time is usually 2:00 PM and check-out is 12:00 PM. Early check-in or late check-out can be requested but depends on availability.' },
    { q: 'How can I become a partner?', a: 'Click on the "Become a Partner" button in the navigation bar to submit your hotel application. Our team will review it within 48 hours.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-slate-50 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-8">How can we help?</h1>
          <div className="relative group max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Search for answers..." 
              className="h-20 pl-16 pr-10 text-xl rounded-[2rem] border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all shadow-xl shadow-slate-100"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Phone, title: 'Call Center', desc: '+1 (888) ELITE-B', color: 'bg-blue-600' },
          { icon: Mail, title: 'Email Support', desc: 'concierge@elitebooking.com', color: 'bg-indigo-600' },
          { icon: MessageSquare, title: 'Live Chat', desc: 'Available 24/7', color: 'bg-emerald-600' },
        ].map((item, i) => (
          <div key={i} className="p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group cursor-pointer text-center">
            <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-8 group-hover:scale-110 transition-transform`}>
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
            <p className="text-slate-500 font-bold">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-slate-50">
        <div className="flex items-center gap-4 mb-12">
          <HelpCircle className="w-10 h-10 text-blue-600" />
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900 pr-8">{faq.q}</h3>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="mt-4 text-slate-500 leading-relaxed hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-24 px-6 text-center">
        <h2 className="text-4xl font-black text-white tracking-tighter mb-8">Still need assistance?</h2>
        <Button variant="premium" size="lg" className="h-16 px-12 rounded-2xl">
          Contact Concierge
        </Button>
      </section>
    </div>
  );
}
