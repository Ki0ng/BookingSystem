'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useApplyManager } from '@/features/auth';
import { Hotel, Building2, MapPin, Phone, FileText, CheckCircle2, ChevronDown, Sparkles, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Skeleton } from '@/shared/components/ui/Skeleton';

export default function ApplyManagerPage() {
  const router = useRouter();
  const {
    user,
    authLoading,
    loading,
    success,
    error,
    formData,
    updateFormData,
    provinces,
    districts,
    selectedProvince,
    setSelectedProvince,
    selectedDistrict,
    setSelectedDistrict,
    showProvincePicker,
    setShowProvincePicker,
    showDistrictPicker,
    setShowDistrictPicker,
    handleSubmit
  } = useApplyManager();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row animate-in fade-in duration-500">
        <div className="w-full md:w-1/2 bg-blue-600 p-12 flex flex-col justify-center space-y-8">
          <Skeleton className="h-10 w-48 bg-white/10 rounded-full" />
          <Skeleton className="h-20 w-full bg-white/10" />
          <Skeleton className="h-24 w-full bg-white/10" />
        </div>
        <div className="w-full md:w-1/2 bg-white p-8 md:p-24 space-y-10">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-14 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500 bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-50">
          <div className="mx-auto w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center shadow-inner">
            <Sparkles className="w-12 h-12 text-blue-600" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 leading-tight">Application Submitted!</h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Your request for <span className="text-blue-600 font-bold">{formData.hotelName}</span> has been received.
              Our admin team will review it within 24-48 hours.
            </p>
          </div>
          <div className="pt-6 space-y-4">
            <div className="p-5 bg-slate-50 rounded-2xl flex items-start gap-4 text-left border border-slate-100">
              <Info className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] leading-relaxed">
                Check your email for status updates.
              </p>
            </div>
            <Link href="/" className="block">
              <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left Side - Info */}
      <div className="w-full md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="relative z-10 space-y-8 max-w-lg mx-auto md:mx-0">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20">
            <Hotel className="w-4 h-4" />
            <span>Elite Partnership Program</span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight">Grow your business with Elite Booking</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Join the most exclusive community of hotel owners and reach thousands of luxury travelers worldwide.
          </p>

          <div className="space-y-6 pt-8">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold">Premium Visibility</p>
                <p className="text-sm text-blue-100">Your hotels showcased to high-end clients.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold">Seamless Management</p>
                <p className="text-sm text-blue-100">Intuitive dashboard to manage bookings and rooms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 bg-white p-8 md:p-24 flex items-center justify-center">
        <div className="max-w-md w-full space-y-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Partner Application</h2>
            <p className="text-gray-500 mt-2">Please provide your hotel and business details.</p>
          </div>

          {!user ? (
            <div className="space-y-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100">
                <Hotel className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-extrabold text-gray-900">Start your journey</h2>
                <p className="text-gray-500 mt-4 leading-relaxed">
                  To apply for the Elite Partnership Program, please sign in to your account first.
                </p>
              </div>
              <Button
                onClick={() => router.push('/login?redirect=/manager/apply')}
                className="w-full h-14 rounded-2xl text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200"
              >
                Sign In to Apply
              </Button>
              <p className="text-sm text-gray-400">
                Don't have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline">Sign up now</Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Hotel Name
                </label>
                <Input
                  required
                  placeholder="e.g. Grand Elite Resort"
                  value={formData.hotelName}
                  onChange={(e) => updateFormData('hotelName', e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Province Picker */}
                <div className="space-y-2 relative">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Province/City
                  </label>
                  <div
                    className="h-12 px-4 rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors bg-white"
                    onClick={() => setShowProvincePicker(!showProvincePicker)}
                  >
                    <span className={selectedProvince ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                      {selectedProvince?.name || 'Select province'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProvincePicker ? 'rotate-180' : ''}`} />
                  </div>

                  {showProvincePicker && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 max-h-[240px] overflow-y-auto animate-in fade-in slide-in-from-top-2">
                      {provinces.map((p) => (
                        <div
                          key={p.code}
                          className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm font-medium transition-colors"
                          onClick={() => {
                            setSelectedProvince(p);
                            setShowProvincePicker(false);
                          }}
                        >
                          {p.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* District Picker */}
                <div className="space-y-2 relative">
                  <label className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${!selectedProvince ? 'text-gray-300' : 'text-gray-700'}`}>
                    <MapPin className="w-4 h-4" /> District
                  </label>
                  <div
                    className={`h-12 px-4 rounded-xl border flex items-center justify-between transition-colors bg-white ${!selectedProvince ? 'border-gray-100 bg-gray-50/50 cursor-not-allowed' : 'border-gray-200 cursor-pointer hover:border-blue-500'}`}
                    onClick={() => selectedProvince && setShowDistrictPicker(!showDistrictPicker)}
                  >
                    <span className={selectedDistrict ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                      {selectedDistrict?.name || 'Select district'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDistrictPicker ? 'rotate-180' : ''}`} />
                  </div>

                  {showDistrictPicker && selectedProvince && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 max-h-[240px] overflow-y-auto animate-in fade-in slide-in-from-top-2">
                      {districts.map((d) => (
                        <div
                          key={d.code}
                          className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm font-medium transition-colors"
                          onClick={() => {
                            setSelectedDistrict(d);
                            setShowDistrictPicker(false);
                          }}
                        >
                          {d.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Business Phone
                </label>
                <Input
                  required
                  placeholder="+84 123 456 789"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Business License (Link/ID)
                </label>
                <Input
                  placeholder="Image URL or License number"
                  value={formData.businessLicense}
                  onChange={(e) => updateFormData('businessLicense', e.target.value)}
                  className="h-12 rounded-xl"
                />
                <p className="text-[10px] text-gray-400 italic mt-1">This helps us verify your property faster.</p>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-medium border border-rose-100">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 rounded-xl text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-gray-400">
            By submitting, you agree to our <a href="#" className="text-blue-600 underline">Terms of Partnership</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
