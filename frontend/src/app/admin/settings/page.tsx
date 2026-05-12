'use client';

import { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Shield, 
  Bell, 
  Globe, 
  Save, 
  Lock, 
  Mail, 
  Camera,
  Percent,
  ToggleRight,
  HardDrive,
  Phone,
  RefreshCcw,
  Chrome
} from 'lucide-react';
import { useAuth, authService } from '@/features/auth';
import { Button } from '@/shared/components/ui/Button';
import { useCloudinary } from '@/shared/hooks/useCloudinary';
import { CloudinaryResult } from '@/shared/types';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { user, refreshProfile } = useAuth();
  const { loaded, openWidget } = useCloudinary();
  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'security' | 'notifications'>('profile');
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const tabs = [
    { id: 'profile', name: 'Profile Settings', icon: UserIcon },
    { id: 'system', name: 'Platform Config', icon: Globe },
    { id: 'security', name: 'Security & Privacy', icon: Shield },
    { id: 'notifications', name: 'Alert Settings', icon: Bell },
  ] as const;

  const handleSave = async () => {
    setLoading(true);
    try {
      await authService.updateProfile({ name, phone, avatar });
      toast.success('Settings updated successfully!');
      refreshProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    openWidget(
      {
        sources: ['local', 'url', 'camera'],
        multiple: false,
        cropping: true,
        croppingAspectRatio: 1,
        showSkipCropButton: false
      },
      (error: Error | null, result: CloudinaryResult) => {
        if (!error && result && result.event === 'success') {
          setAvatar(result.info.secure_url);
          toast.success('Avatar uploaded!');
        }
      }
    );
  };

  return (
    <div className="space-y-10">
      <div>
        <p className="text-purple-600 font-black text-sm uppercase tracking-[0.3em] mb-2">Central Authority</p>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">System Control Center</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-80 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
              {activeTab === tab.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            {activeTab === 'profile' && (
              <div className="p-10 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
                        <img 
                          src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button 
                        onClick={handleAvatarUpload}
                        disabled={!loaded}
                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white border-4 border-white shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loaded ? <Camera className="w-4 h-4" /> : <RefreshCcw className="w-4 h-4 animate-spin" />}
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Administrator Profile</h3>
                      <p className="text-sm text-slate-400 font-medium mt-1">Manage your public identity on the platform.</p>
                      {user?.googleId && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full w-fit">
                          <Chrome className="w-3 h-3 text-blue-600" />
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Synced with Google Account</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
                    <div className="relative">
                      <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-12 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Authority</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        disabled
                        value={user?.email || ''}
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-12 font-bold text-slate-400 outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Your phone number"
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-12 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="p-10 space-y-10">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <HardDrive className="w-6 h-6 text-blue-600" />
                  Platform Core Configuration
                </h3>

                <div className="space-y-8">
                  <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                        <Percent className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">Commission Rate</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Platform fee deducted from every booking.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input defaultValue="12" className="w-16 h-12 bg-white border border-slate-200 rounded-xl text-center font-black text-slate-900" />
                      <span className="font-black text-slate-900">%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                        <ToggleRight className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">Maintenance Mode</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Temporarily disable public access to the platform.</p>
                      </div>
                    </div>
                    <div className="w-14 h-8 bg-slate-200 rounded-full relative cursor-pointer group">
                      <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-10 space-y-10">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-purple-600" />
                  Password Management
                </h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                      <input type="password" placeholder="Minimum 8 characters" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Identity</label>
                      <input type="password" placeholder="Re-type new password" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
              <Button variant="ghost" className="rounded-xl px-8 font-bold text-slate-400 hover:text-slate-900">Discard Changes</Button>
              <Button 
                onClick={handleSave} 
                disabled={loading}
                className="bg-slate-900 text-white rounded-xl px-10 font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200"
              >
                {loading ? 'Saving Protocols...' : 'Securely Save Settings'}
                <Save className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
