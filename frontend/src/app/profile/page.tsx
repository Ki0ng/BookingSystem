'use client';

import React from 'react';
import { ProfileSkeleton } from '@/shared/components/ui/ProfileSkeleton';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { User as UserIcon, Mail, Phone, Calendar, ShieldCheck, CreditCard, LogOut, Camera } from 'lucide-react';
import { useProfile } from '@/features/auth';
import Link from 'next/link';

export default function ProfilePage() {
  const {
    user,
    loading,
    saving,
    name,
    setName,
    phone,
    setPhone,
    message,
    handleSave,
    logout
  } = useProfile();

  if (loading) return <ProfileSkeleton />;
  if (!user) return <div className="pt-16 text-center">Please login to view your profile.</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8 sticky top-16">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name || 'User'} className="w-32 h-32 rounded-full object-cover shadow-xl shadow-blue-100" />
                  ) : (
                    <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-200">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">{user.name || 'Elite Member'}</h2>
                  <p className="text-gray-500 font-medium text-sm capitalize">{user.role.toLowerCase()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  key="Personal Info"
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all bg-blue-600 text-white shadow-lg shadow-blue-100"
                >
                  <UserIcon className="w-5 h-5" />
                  Personal Info
                </button>

                <Link href="/bookings">
                  <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                    <Calendar className="w-5 h-5" />
                    My Bookings
                  </button>
                </Link>

                <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                  <CreditCard className="w-5 h-5" />
                  Payments
                </button>

                <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                  <ShieldCheck className="w-5 h-5" />
                  Security
                </button>
              </div>

              <div className="pt-6 border-t border-gray-50">
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="w-full justify-start text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-2xl h-14 font-bold"
                >
                  <LogOut className="w-5 h-5 mr-3" /> Logout
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-gray-100 shadow-sm space-y-12">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900">Account Settings</h1>
                  <p className="text-gray-500 mt-2 font-medium">Manage your personal information and preferences.</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Verified
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-4 ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="pl-12 h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input value={user.email} disabled className="pl-12 h-14 rounded-2xl bg-gray-50 border-transparent font-bold opacity-60" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Add your phone number" 
                      className="pl-12 h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Date Joined</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input value={new Date(user.createdAt).toLocaleDateString('en-GB')} disabled className="pl-12 h-14 rounded-2xl bg-gray-50 border-transparent font-bold opacity-60" />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="h-14 px-12 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 font-bold text-lg disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Bookings', value: '12', color: 'bg-blue-600' },
                { label: 'Review Written', value: '8', color: 'bg-emerald-600' },
                { label: 'Reward Points', value: '2,450', color: 'bg-amber-500' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-4xl font-black ${stat.label === 'Total Bookings' ? 'text-blue-600' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
