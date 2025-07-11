import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export interface UploadedImage {
  url: string;
  name: string;
  size: number;
}

export interface UseImageUploadOptions {
  maxSize?: number; // in bytes
  maxFiles?: number;
  allowedTypes?: string[];
  onUploadSuccess?: (images: UploadedImage[]) => void;
  onUploadError?: (error: Error) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [preview, setPreview] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    maxFiles = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    onUploadSuccess,
    onUploadError,
  } = options;

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      onUploadSuccess?.(data);
    },
    onError: (error) => {
      onUploadError?.(error as Error);
    },
  });

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }
    
    if (file.size > maxSize) {
      return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
    }
    
    return null;
  };

  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate each file
    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    // Check file count limit
    if (selectedFiles.length + validFiles.length > maxFiles) {
      errors.push(`Cannot select more than ${maxFiles} files`);
      return { success: false, errors };
    }

    // Create previews
    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string);
          if (newPreviews.length === validFiles.length) {
            setPreview(prev => [...prev, ...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    return { success: true, errors: [] };
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreview(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setPreview([]);
  };

  const uploadImages = () => {
    if (selectedFiles.length === 0) return;
    uploadMutation.mutate(selectedFiles);
  };

  return {
    selectedFiles,
    preview,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    uploadSuccess: uploadMutation.isSuccess,
    handleFileSelect,
    removeFile,
    clearFiles,
    uploadImages,
    validateFile,
  };
}