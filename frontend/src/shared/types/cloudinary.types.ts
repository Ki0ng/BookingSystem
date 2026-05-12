export interface CloudinaryResult {
  event: string;
  info: {
    secure_url: string;
  };
}

export interface CloudinaryWidget {
  open: () => void;
  destroy: () => void;
}

export interface Cloudinary {
  createUploadWidget: (
    options: Record<string, any>,
    callback: (error: Error | null, result: CloudinaryResult) => void
  ) => CloudinaryWidget;
}
