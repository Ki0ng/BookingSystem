'use client';

import React from 'react';
import {
  Hotel,
  MapPin,
  Image as ImageIcon,
  Wifi,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Info,
  Save,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useEditHotel } from '@/features/hotels';
import { CloudinaryUpload } from '@/shared/components/ui/CloudinaryUpload';

const AMENITIES_OPTIONS = [
  "Wifi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Parking", "Air Conditioning", "Bathtub", "Kitchen"
];

export default function EditHotelPage() {
  const {
    loading,
    saving,
    error,
    formData,
    updateFormData,
    addImage,
    removeImage,
    toggleAmenity,
    handleSubmit
  } = useEditHotel();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold">Loading property details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <Link
        href="/manager/hotels"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold">Back to Properties</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Edit <span className="text-blue-600">Property</span></h1>
            <p className="text-slate-500">Update your property details to keep guests informed.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-12">
            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-black text-slate-900">General Information</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Hotel Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    required
                    className="rounded-xl h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    required
                    className="w-full min-h-[120px] rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Location Details</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Property Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      required
                      placeholder="e.g. 123 Luxury Ave, Ward 1, District 1, Ho Chi Minh City"
                      className="pl-12 rounded-xl h-14 font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified official location
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Latitude</label>
                    <Input
                      type="number"
                      step="any"
                      name="location_lat"
                      value={formData.location_lat}
                      onChange={(e) => updateFormData('location_lat', e.target.value)}
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Longitude</label>
                    <Input
                      type="number"
                      step="any"
                      name="location_lng"
                      value={formData.location_lng}
                      onChange={(e) => updateFormData('location_lng', e.target.value)}
                      className="rounded-xl h-12"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Property Photos</h2>
              </div>

              <div className="space-y-4">
                <CloudinaryUpload
                  images={formData.images}
                  onUploadSuccess={addImage}
                  onRemoveImage={removeImage}
                  maxImages={10}
                />
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Wifi className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Amenities</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES_OPTIONS.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.amenities.includes(amenity)
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700'
                      : 'border-slate-50 hover:border-slate-200 text-slate-500'
                      }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${formData.amenities.includes(amenity) ? 'opacity-100' : 'opacity-0'}`} />
                    <span className="text-sm font-bold">{amenity}</span>
                  </button>
                ))}
              </div>
            </section>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            <div className="pt-6">
              <Button
                type="submit"
                disabled={saving}
                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-200 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:w-80">
          <div className="sticky top-10">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Live Preview</h3>
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50 group">
              <div className="relative h-48 bg-slate-100">
                {formData.images[0] ? (
                  <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Hotel className="w-12 h-12 text-slate-200" />
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-lg font-black text-slate-900 truncate">{formData.name || 'Your Hotel Name'}</h4>
                  <div className="flex items-center gap-1 text-slate-400 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-medium truncate">{formData.address || 'Address'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <div className="flex flex-wrap gap-1">
                    {formData.amenities.slice(0, 3).map(a => (
                      <span key={a} className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
