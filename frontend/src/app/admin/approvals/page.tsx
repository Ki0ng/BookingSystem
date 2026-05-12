'use client';

import { useState, useEffect } from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  ExternalLink, 
  Mail, 
  Phone, 
  Building2,
  Calendar,
  Search,
  Filter,
  MessageSquare
} from 'lucide-react';
import apiClient from '@/core/api/api-client';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useSocket } from '@/shared/providers/SocketProvider';
import { ManagerApplication, ApiResponse } from '@/shared/types';

type UIApp = ManagerApplication & { isNew?: boolean };

export default function AdminApprovals() {
  const [applications, setApplications] = useState<UIApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});

  const updateComment = (id: string, value: string) => {
    setComments(prev => ({ ...prev, [id]: value }));
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<ApiResponse<UIApp[]>>('/admin/applications');
      setApplications(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Real-time listener for new applications
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;

    const handleNewApp = (app: ManagerApplication) => {
      setApplications(prev => {
        if (prev.find(a => a.id === app.id)) return prev;
        return [{ ...app, isNew: true }, ...prev];
      });
    };

    socket.on('new_application', handleNewApp);
    return () => {
      socket.off('new_application', handleNewApp);
    };
  }, [socket]);

  const handleDecision = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) return;
    
    setSubmitting(id);
    try {
      // Sửa URL: Chỉ gửi đến /applications/${id} và truyền status vào body
      await apiClient.patch(`/admin/applications/${id}`, { 
        status, 
        adminComment: comments[id] || '' 
      });
      setApplications(prev => prev.filter(app => app.id !== id));
      setComments(prev => {
        const newComments = { ...prev };
        delete newComments[id];
        return newComments;
      });
      alert(`Application ${status.toLowerCase()} successfully!`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to process application';
      alert(`Error: ${msg}`);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 p-10">
        <div className="flex justify-between items-center mb-10">
          <div className="w-64 h-12 bg-slate-100 animate-pulse rounded-2xl" />
          <div className="w-32 h-10 bg-slate-50 animate-pulse rounded-xl" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-100 animate-pulse rounded-2xl" />
              <div className="space-y-2">
                <div className="w-40 h-4 bg-slate-100 animate-pulse rounded-full" />
                <div className="w-24 h-3 bg-slate-50 animate-pulse rounded-full" />
              </div>
            </div>
            <div className="space-y-2 flex-1 max-w-md">
              <div className="w-full h-4 bg-slate-50 animate-pulse rounded-full" />
              <div className="w-2/3 h-3 bg-slate-50 animate-pulse rounded-full" />
            </div>
            <div className="flex gap-3">
              <div className="w-24 h-10 bg-slate-50 animate-pulse rounded-xl" />
              <div className="w-24 h-10 bg-slate-50 animate-pulse rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pending Partner Requests</h2>
          <p className="text-slate-500 font-medium mt-1">Found {applications.length} applications waiting for review.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search applicants..." className="pl-12 h-12 rounded-2xl border-slate-100 shadow-sm" />
          </div>
          <Button variant="outline" className="h-12 rounded-2xl border-slate-200 px-6 font-bold flex items-center gap-2 bg-white">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">All Clear!</h3>
          <p className="text-slate-500 mt-2 font-medium">There are no pending applications at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {applications.map((app) => (
            <div 
              key={app.id} 
              className={`bg-white rounded-[3rem] border transition-all duration-500 overflow-hidden flex flex-col ${
                app.isNew ? 'border-blue-300 ring-4 ring-blue-50 animate-slide-in animate-pulse-subtle shadow-2xl' : 'border-slate-100 shadow-sm'
              } hover:shadow-2xl`}
            >
              <div className="p-10 flex-1">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-2xl shadow-inner border border-blue-100">
                      {app.user?.name?.[0] || 'P'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 leading-tight">{app.hotelName}</h3>
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                        <Building2 className="w-3 h-3" /> Partner: {app.user?.name || 'Anonymous'}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                    Review Required
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm font-medium">{app.user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">{app.user?.phone || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-600 font-bold">
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm cursor-pointer hover:underline">View Business License</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Building2 className="w-3 h-3" /> Proposed Address
                  </p>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{app.hotelAddress}</p>
                </div>

                <div className="mt-8 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> Admin Decision Note (Optional)
                  </label>
                  <textarea 
                    placeholder="Provide feedback to the applicant..."
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none h-24"
                    value={comments[app.id] || ''}
                    onChange={(e) => updateComment(app.id, e.target.value)}
                  />
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <Button 
                  disabled={submitting === app.id}
                  onClick={() => handleDecision(app.id, 'REJECTED')}
                  variant="outline" 
                  className="flex-1 h-14 rounded-2xl border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white font-black shadow-sm"
                >
                  <XCircle className="w-5 h-5 mr-2" /> Reject Application
                </Button>
                <Button 
                  disabled={submitting === app.id}
                  onClick={() => handleDecision(app.id, 'APPROVED')}
                  className="flex-1 h-14 rounded-2xl bg-slate-900 text-white hover:bg-emerald-600 font-black shadow-xl transition-all"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Approve & Activate
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
