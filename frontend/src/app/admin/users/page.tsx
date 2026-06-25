'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  User as UserIcon, 
  Search, 
  Mail, 
  Calendar,
  Briefcase
} from 'lucide-react';
import apiClient from '@/core/api/api-client';
import { format } from 'date-fns';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="h-4 w-28 bg-slate-200 rounded-md animate-pulse mb-2" />
            <div className="h-10 w-48 bg-slate-200 rounded-md animate-pulse" />
          </div>
          <div className="h-16 w-full md:w-96 bg-slate-200 rounded-[2rem] animate-pulse" />
        </div>
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[1, 2, 3, 4].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-200" />
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-slate-200 rounded w-32" />
                        <div className="h-3 bg-slate-200 rounded w-48 mt-1" />
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="h-7 w-20 bg-slate-200 rounded-full" />
                  </td>
                  <td className="p-8">
                    <div className="h-5 w-24 bg-slate-200 rounded-md" />
                  </td>
                  <td className="p-8 text-right">
                    <div className="h-6 w-16 bg-slate-200 rounded-full ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-purple-600 font-black text-sm uppercase tracking-[0.3em] mb-2">Administration</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">User Directory</h2>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2rem] flex items-center px-6 h-16 shadow-sm w-full md:w-96 focus-within:border-purple-600 transition-all">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input 
            placeholder="Search by name or email..." 
            className="bg-transparent outline-none text-sm font-medium text-slate-900 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                      {u.avatar ? (
                        <img src={u.avatar} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {u.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    u.role === 'ADMIN' 
                      ? 'bg-purple-50 text-purple-600' 
                      : u.role === 'MANAGER' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-slate-50 text-slate-500'
                  }`}>
                    {u.role === 'ADMIN' ? <ShieldCheck className="w-3 h-3" /> : u.role === 'MANAGER' ? <Briefcase className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-300" />
                    {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="p-8 text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
