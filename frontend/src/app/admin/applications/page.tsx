'use client';

import { useState, useEffect } from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  Building2, 
  Mail, 
  MapPin
} from 'lucide-react';
import { adminService } from '@/features/admin';
import { Button } from '@/shared/components/ui/Button';
import { ManagerApplication } from '@/shared/types';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<ManagerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await adminService.getApplications();
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id);
    try {
      if (status === 'APPROVED') {
        await adminService.approveApplication(id);
        alert('Application approved successfully!');
      } else {
        await adminService.rejectApplication(id);
        alert('Application rejected.');
      }
      setApplications(applications.filter(a => a.id !== id));
    } catch (err) {
      alert(`Failed to ${status.toLowerCase()} application`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Applications...</div>;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-purple-600 font-black text-sm uppercase tracking-[0.3em] mb-2">Administration</p>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Manager Applications</h2>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicant</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hotel Details</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Business License</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No pending applications</p>
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                        {app.user?.name?.[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{app.user?.name}</p>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {app.user?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div>
                      <p className="font-bold text-slate-800 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-500" /> {app.hotelName}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {app.hotelAddress}
                      </p>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="max-w-xs">
                      <p className="text-xs text-slate-500 font-bold leading-relaxed truncate">
                        {app.businessLicense || 'Not provided'}
                      </p>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Button 
                        onClick={() => handleAction(app.id, 'REJECTED')}
                        disabled={processingId === app.id}
                        variant="ghost" 
                        className="h-11 px-6 rounded-xl text-rose-500 hover:bg-rose-50 font-black text-[10px] uppercase tracking-widest"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                      <Button 
                        onClick={() => handleAction(app.id, 'APPROVED')}
                        disabled={processingId === app.id}
                        className="h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
