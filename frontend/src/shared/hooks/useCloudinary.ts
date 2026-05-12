'use client';

import { useState, useEffect } from 'react';
import { Cloudinary, CloudinaryResult } from '@/shared/types';

declare global {
  interface Window {
    cloudinary: Cloudinary;
  }
}

export const useCloudinary = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.cloudinary) {
      setLoaded(true);
      return;
    }

    const existingScript = document.getElementById('cloudinary-widget-script');
    if (existingScript) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'cloudinary-widget-script';
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => {
      setLoaded(true);
    };
    script.onerror = () => console.error('❌ Failed to load Cloudinary Widget');
    document.body.appendChild(script);
  }, []);

  const openWidget = (
    options: Record<string, any>, 
    callback: (error: Error | null, result: CloudinaryResult) => void
  ) => {
    if (!loaded) {
      console.warn('⚠️ Cloudinary Widget is not loaded yet. Please wait.');
      return;
    }

    if (!window.cloudinary) {
      console.error('❌ Cloudinary object not found on window');
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error('❌ Cloudinary Configuration Error:', {
        cloudName: cloudName || 'MISSING',
        uploadPreset: uploadPreset || 'MISSING'
      });
      alert('Lỗi: Chưa có cấu hình Cloudinary. Hãy chắc chắn bạn đã Restart Server sau khi sửa .env.local');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        ...options
      },
      callback
    );
    widget.open();
  };

  return { loaded, openWidget };
};
