'use client';

import { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  Bell,
  Globe,
  Camera,
  Save,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useAuth, authService } from '@/features/auth';

export default function ManagerSettingsPage() {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await authService.updateProfile({
        name: formData.name,
        phone: formData.phone
      });
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <p className="text-blue-600 font-black text-sm uppercase tracking-widest mb-1">Configuration</p>
        <h2 className="text-4xl font-black text-slate-900">Account Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-6 py-4 bg-white text-blue-600 font-black rounded-2xl shadow-sm border border-slate-100 transition-all">
            <User className="w-5 h-5" /> Profile Information
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-4 text-slate-500 font-bold hover:bg-white rounded-2xl transition-all">
            <Shield className="w-5 h-5" /> Security & Password
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-4 text-slate-500 font-bold hover:bg-white rounded-2xl transition-all">
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-4 text-slate-500 font-bold hover:bg-white rounded-2xl transition-all">
            <Globe className="w-5 h-5" /> Business Details
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
            {/* Avatar Section */}
            <div className="flex items-center gap-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner">
                  {user?.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <User className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                </div>
                <button type="button" className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Profile Photo</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">PNG, JPG or GIF. Max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="h-14 rounded-2xl border-slate-100 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Phone</label>
                <Input
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="h-14 rounded-2xl border-slate-100 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Input
                  disabled
                  value={formData.email}
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed pl-12"
                />
                <Mail className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400 italic">Email cannot be changed. Contact support for assistance.</p>
            </div>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
              <div>
                {success && (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm animate-in fade-in slide-in-from-left-4">
                    <CheckCircle2 className="w-5 h-5" /> Changes saved successfully!
                  </div>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-xl shadow-blue-100 flex items-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>

          {/* Danger Zone */}
          <div className="bg-rose-50 p-10 rounded-[2.5rem] border border-rose-100 space-y-4">
            <h3 className="text-rose-900 font-black text-lg">Danger Zone</h3>
            <p className="text-rose-600/70 text-sm font-medium">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="ghost" className="text-rose-600 hover:bg-rose-100 h-12 rounded-xl font-bold px-6 border border-rose-200">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
