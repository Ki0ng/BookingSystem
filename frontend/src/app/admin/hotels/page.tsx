'use client';

import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Star,
  User, 
  Search, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { adminService } from '@/features/admin';
import { Hotel } from '@/shared/types';

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await adminService.getHotels();
      setHotels(res.data || []);
    } catch (err) {
      console.error('Failed to fetch hotels', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter(h => 
    h.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Property Inventory...</div>;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-purple-600 font-black text-sm uppercase tracking-[0.3em] mb-2">Administration</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Global Properties</h2>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2rem] flex items-center px-6 h-16 shadow-sm w-full md:w-96 focus-within:border-purple-600 transition-all">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input 
            placeholder="Search by hotel name or city..." 
            className="bg-transparent outline-none text-sm font-medium text-slate-900 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredHotels.map((h) => (
          <div key={h.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-slate-50 relative">
                <img 
                  src={h.images?.[0]?.url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[8px] font-black uppercase flex items-center gap-1 shadow-sm">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> {h.average_rating || '5.0'}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{h.name}</h3>
                <p className="text-sm text-slate-400 font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" /> {h.address}
                </p>
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Property Owner</p>
                      <p className="text-xs font-bold text-slate-900">{h.owner?.name}</p>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-slate-100" />
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Room Types</p>
                    <p className="text-xs font-bold text-slate-900">{h._count?.rooms || 0} Registered</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> Approved
                </span>
              </div>
              <button className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
