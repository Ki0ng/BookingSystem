'use client';

import React from 'react';
import {
  Building2,
  ChevronLeft,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import Link from 'next/link';
import { CloudinaryUpload } from '@/shared/components/ui/CloudinaryUpload';
import { useNewHotel } from '@/features/hotels';

export default function NewHotelPage() {
  const {
    loading,
    error,
    formData,
    updateFormData,
    addImage,
    removeImage,
    handleSubmit
  } = useNewHotel();

  if (loading && !formData.name) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Syncing Property Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex items-center gap-6">
        <Link href="/manager/hotels">
          <button className="p-3 hover:bg-white rounded-2xl shadow-sm border border-slate-100 transition-all">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-4xl font-black text-slate-900">
            Add Property
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Register your new luxury hotel on Elite Booking.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Basic Information
              </label>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Hotel Name</label>
                    <Input
                      required
                      placeholder="e.g. The Royal Serenity Resort"
                      value={formData.name}
                      onChange={e => updateFormData('name', e.target.value)}
                      className="h-14 rounded-2xl border-slate-200 focus:ring-blue-600"
                    />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Description</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your property's unique charm and luxury amenities..."
                    value={formData.description}
                    onChange={e => updateFormData('description', e.target.value)}
                    className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Property Address</label>
                    <Input
                      required
                      placeholder="Enter full address"
                      value={formData.address}
                      onChange={e => updateFormData('address', e.target.value)}
                      className="h-14 rounded-2xl border-slate-200 focus:ring-blue-600"
                    />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions & Media */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Gallery
            </label>
            <div className="space-y-4">
              <CloudinaryUpload
                images={formData.images.filter(url => url.trim() !== '')}
                onUploadSuccess={addImage}
                onRemoveImage={removeImage}
                maxImages={10}
              />
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200/50 space-y-8">
            <div>
              <h3 className="text-xl font-black flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" /> Ready to Launch?
              </h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Your property will be reviewed by our elite curators before going live.
              </p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs font-bold">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-20 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-2xl shadow-blue-600/40 transition-all active:scale-95 flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    CREATE PROPERTY NOW
                  </>
                )}
              </Button>
              <Link href="/manager/hotels" className="block text-center">
                <p className="text-slate-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] py-3 cursor-pointer">
                  Discard & Return to List
                </p>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
