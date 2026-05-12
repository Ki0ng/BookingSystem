import { DollarSign, X, CreditCard, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { PaymentData } from '@/features/bookings/types';
import { usePaymentForm } from '@/shared/hooks/usePaymentForm';

interface PaymentModalProps {
  amount: number;
  guests: number;
  onConfirm: (data: PaymentData) => void;
  onClose: () => void;
  isLoading: boolean;
}

export const PaymentModal = ({ amount, guests, onConfirm, onClose, isLoading }: PaymentModalProps) => {
  const { paymentData, updateField, isValid } = usePaymentForm();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-[0_0_100px_rgba(37,99,235,0.2)] overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-500">
        
        {/* Left Side: Summary & Card Preview */}
        <div className="md:w-5/12 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black tracking-tight">Elite Checkout</h3>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Payable Amount</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">${amount}</span>
                  <span className="text-slate-500 text-xs font-bold">USD</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Confirmation</p>
                    <p className="text-xs font-bold">Instant Confirmation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Security</p>
                    <p className="text-xs font-bold">Secured by Elite Shield</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Virtual Card Preview */}
          <div className="mt-12 relative z-10 group perspective-1000">
            <div className="w-full aspect-[1.6/1] bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-700 group-hover:rotate-y-12">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <div className="flex justify-between items-start mb-10">
                <div className="w-12 h-10 bg-amber-400/80 rounded-lg flex flex-col gap-1.5 p-2">
                  <div className="h-0.5 bg-black/20 w-full"></div>
                  <div className="h-0.5 bg-black/20 w-full"></div>
                  <div className="h-0.5 bg-black/20 w-full"></div>
                </div>
                <CreditCard className="w-8 h-8 text-white/50" />
              </div>

              <div className="space-y-6">
                <div className="text-lg font-mono tracking-[0.25em] text-white/90 truncate">
                  {paymentData.cardNumber || '•••• •••• •••• ••••'}
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[8px] text-white/40 uppercase tracking-widest">Card Holder</p>
                    <p className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">
                      {paymentData.cardName || 'YOUR NAME'}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[8px] text-white/40 uppercase tracking-widest">Expires</p>
                    <p className="text-[10px] font-black">{paymentData.expiry || 'MM/YY'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-12 bg-white flex flex-col justify-between">
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Payment Details</h2>
              <p className="text-sm text-slate-500 font-medium">Please enter your billing information below.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="E.g. JOHN DOE"
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all uppercase placeholder:text-slate-300"
                  value={paymentData.cardName}
                  onChange={(e) => updateField('cardName', e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 pl-14 font-bold text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
                    value={paymentData.cardNumber}
                    onChange={(e) => updateField('cardNumber', e.target.value)}
                  />
                  <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
                    value={paymentData.expiry}
                    onChange={(e) => updateField('expiry', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">CVV</label>
                  <input
                    type="password"
                    placeholder="XXX"
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
                    value={paymentData.cvv}
                    onChange={(e) => updateField('cvv', e.target.value)}
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 space-y-4">
            <Button
              onClick={() => onConfirm(paymentData)}
              disabled={isLoading || !isValid}
              variant="premium"
              className="w-full h-16 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Transaction...</span>
                </div>
              ) : (
                `Pay $${amount} & Confirm Stay`
              )}
            </Button>
            <button 
              onClick={onClose} 
              className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors py-2"
            >
              Cancel Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
