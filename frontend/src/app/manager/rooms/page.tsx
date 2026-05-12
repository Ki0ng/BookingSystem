'use client';

import React, { useState, useEffect } from 'react';
import {
  Hotel,
  Plus,
  Trash2,
  Edit,
  Users,
  ChevronLeft,
  XCircle,
  Sparkles,
  BedDouble
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import Link from 'next/link';
import { CloudinaryUpload } from '@/shared/components/ui/CloudinaryUpload';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { useManagerRooms } from '@/features/hotels';
import { createPortal } from 'react-dom';

import dynamic from 'next/dynamic';

const ManagerRoomsContent = dynamic(() => Promise.resolve(function ManagerRoomsContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const {
    rooms,
    hotel,
    loading,
    showAddForm,
    setShowAddForm,
    editingRoomId,
    submitting,
    myHotels,
    formData,
    updateFormData,
    showSetupGuide,
    setShowSetupGuide,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
    hotelId,
    router
  } = useManagerRooms();

  if (loading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-28 rounded-[2rem]" />
          ))}
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-50 shadow-sm p-5 space-y-5">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hotelId) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <div>
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest leading-none mb-1">{hotel?.rooms?.length || 0} Units</p>
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none">Management</p>
              </div>
            </div>
            <Link href={`/manager/rooms?hotelId=${hotel?.id}`}>
              <Button variant="ghost" className="text-blue-600 hover:bg-white rounded-lg h-10 px-4 font-bold uppercase text-[8px] tracking-widest shadow-sm">
                Configure
              </Button>
            </Link>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none mt-6">Identify Property</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myHotels.map(h => (
            <div
              key={h.id}
              onClick={() => router.push(`/manager/rooms?hotelId=${h.id}`)}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-bl-[3rem] transition-all" />
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blue-100">
                <Hotel className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-1 tracking-tight group-hover:text-blue-600 transition-colors">{h.name}</h3>
              <p className="text-slate-400 text-[11px] font-medium line-clamp-1 mb-6">{h.address}</p>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{h.rooms?.length || 0} Units Configured</span>
                <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/manager/hotels">
            <button className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:shadow-xl transition-all duration-500 group">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
          </Link>
          <div>
            <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">{hotel?.name}</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">Inventory & Pricing</h2>
          </div>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="rounded-xl h-14 px-8 bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-200 font-bold uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Add New Unit
        </Button>
      </div>

      {/* Setup Guide Alert */}
      {showSetupGuide && (
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200 animate-in slide-in-from-top-10 duration-700 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full -mr-40 -mt-40 blur-3xl group-hover:bg-blue-600/20 transition-all duration-1000" />
          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight italic">Almost there, Manager!</h3>
            </div>
            <p className="text-slate-400 text-base font-medium leading-relaxed">
              Your property is registered. Finalize your configuration by adding your first <span className="text-blue-400 font-bold">Room Type</span>. Set the standard for elite hospitality.
            </p>
            <div className="pt-4 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-10 h-10 rounded-full border-4 border-slate-900 flex items-center justify-center text-[10px] font-bold ${i === 1 ? 'bg-emerald-500 text-white' : i === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                    {i === 1 ? '✓' : i === 2 ? '2' : '3'}
                  </div>
                ))}
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-400">
                Optimization Phase: 2/3
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSetupGuide(false)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors border border-white/10"
          >
            <XCircle className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      )}

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-200 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-[4rem] transition-all" />
          <p className="text-blue-100 text-[9px] font-bold uppercase tracking-[0.3em] mb-2">Total Capacity</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-extrabold tracking-tight leading-none">{rooms.reduce((acc, r) => acc + (r.quantity * r.capacity), 0)}</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100 mb-0.5">Guests</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group relative overflow-hidden hover:shadow-2xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] transition-all" />
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em] mb-2">Portfolio Pricing</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
              ${Math.round(rooms.reduce((acc, r) => acc + r.base_price, 0) / (rooms.length || 1))}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Avg/Night</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group relative overflow-hidden hover:shadow-2xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] transition-all" />
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em] mb-2">Configuration</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">{rooms.length}</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Unit Types</span>
          </div>
        </div>
      </div>

      {/* Room Table - Elite Version */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-7 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Unit Identity</th>
                <th className="p-7 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Base Revenue</th>
                <th className="p-7 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Specs</th>
                <th className="p-7 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Inventory</th>
                <th className="p-7 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Status</th>
                <th className="p-7 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50/30 transition-all duration-300 group">
                  <td className="p-7">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500 flex items-center justify-center relative">
                        {room.images?.[0]?.url ? (
                          <img 
                            src={room.images[0].url} 
                            alt={room.room_type} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent" />
                            <BedDouble className="w-5 h-5 text-slate-200 relative z-10" />
                            <span className="text-[6px] font-black text-slate-300 uppercase tracking-[0.2em] relative z-10">Pending</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-900 tracking-tight">{room.room_type}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ref: {room.id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-7">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-blue-600 tracking-tight">${room.base_price}</span>
                      <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">/ Night</span>
                    </div>
                  </td>
                  <td className="p-7">
                    <div className="flex items-center gap-2.5 text-slate-900 font-bold text-xs">
                      <div className="p-1.5 bg-slate-100 rounded-lg">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      {room.capacity} Gst
                    </div>
                  </td>
                  <td className="p-7">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">{room.quantity} Units</span>
                    </div>
                  </td>
                  <td className="p-7">
                    <div className={`px-3.5 py-1.5 rounded-xl inline-flex items-center gap-2 border ${room.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                      room.status === 'MAINTENANCE' ? 'bg-amber-50 text-amber-600 border-amber-100/50' :
                        'bg-rose-50 text-rose-600 border-rose-100/50'
                      }`}>
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${room.status === 'AVAILABLE' ? 'bg-emerald-500' :
                        room.status === 'MAINTENANCE' ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">{room.status}</span>
                    </div>
                  </td>
                  <td className="p-7 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleEdit(room)}
                        className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:shadow-xl transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:shadow-xl transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>      {/* Add Room Modal - Elite Version */}
      {mounted && showAddForm && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
            <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
              {/* Header - Fixed */}
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative z-10">
                  <p className="text-blue-600 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">{editingRoomId ? 'Modify Strategy' : 'New Configuration'}</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{editingRoomId ? 'Edit Room Type' : 'Register Room Type'}</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => resetForm()} 
                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:rotate-90 transition-all shadow-sm border border-slate-100 relative z-10"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              {/* Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Identity</label>
                    <Input
                      required
                      placeholder="Deluxe Ocean Suite"
                      value={formData.room_type}
                      onChange={e => updateFormData('room_type', e.target.value)}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Base Price ($)</label>
                    <Input
                      required
                      type="number"
                      placeholder="499"
                      value={formData.base_price}
                      onChange={e => updateFormData('base_price', e.target.value)}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-extrabold text-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Total Inventory</label>
                    <Input
                      required
                      type="number"
                      placeholder="12"
                      value={formData.quantity}
                      onChange={e => updateFormData('quantity', e.target.value)}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Max Capacity</label>
                    <Input
                      required
                      type="number"
                      placeholder="4"
                      value={formData.capacity}
                      onChange={e => updateFormData('capacity', e.target.value)}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Visual Assets</label>
                  <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 border-dashed group-hover:border-blue-400 transition-all shadow-inner">
                    <CloudinaryUpload
                      images={formData.images.filter(url => url.trim() !== '')}
                      onUploadSuccess={(url) => updateFormData('images', [...formData.images.filter(img => img.trim() !== ''), url])}
                      onRemoveImage={(url) => updateFormData('images', formData.images.filter(img => img !== url))}
                      maxImages={5}
                    />
                  </div>
                </div>
              </div>

              {/* Footer - Fixed */}
              <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex gap-4 shrink-0">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => resetForm()} 
                  className="flex-1 h-14 rounded-2xl font-bold uppercase text-[10px] tracking-widest border-slate-200 text-slate-400 hover:bg-white hover:text-slate-900 transition-all"
                >
                  Discard Changes
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting} 
                  className="flex-2 h-14 rounded-2xl font-bold uppercase text-[10px] tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98] px-10"
                >
                  {submitting ? 'Processing...' : (editingRoomId ? 'Update Configuration' : 'Create Room Type')}
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}), { 
  ssr: false,
  loading: () => (
    <div className="space-y-10">
      <Skeleton className="h-20 w-full rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 rounded-[2rem]" />
        <Skeleton className="h-32 rounded-[2rem]" />
        <Skeleton className="h-32 rounded-[2rem]" />
      </div>
      <Skeleton className="h-96 rounded-[2rem]" />
    </div>
  )
});

export default function ManagerRoomsPage() {
  return (
    <Suspense fallback={null}>
      <ManagerRoomsContent />
    </Suspense>
  );
}
