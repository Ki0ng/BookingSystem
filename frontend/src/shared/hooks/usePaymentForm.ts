'use client';

import { useState } from 'react';
import { PaymentData } from '@/features/bookings/types';

export const usePaymentForm = () => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: ''
  });

  const updateField = (field: keyof PaymentData, value: string) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
    } else if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').substring(0, 5);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    setPaymentData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const isValid = paymentData.cardNumber.replace(/\s/g, '').length >= 12 && 
                  paymentData.cardName.length >= 2 && 
                  paymentData.expiry.length === 5 && 
                  paymentData.cvv.length === 3;

  return {
    paymentData,
    updateField,
    isValid
  };
};
