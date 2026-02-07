"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaSave, FaTimes, FaImage, FaTrash, FaSpinner } from 'react-icons/fa';
import { ProductFormData } from '@/types';
import { useProducts } from '@/contexts/ProductsContext';
import { useToast } from '@/contexts/ToastContext';
import { ApiError } from '@/lib/api';

const MAX_IMAGES = 10;
const MAX_FILE_SIZE_MB = 10;
const COMPRESS_NOTICE_MB = 5;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const { getProductById, updateProduct } = useProducts();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    images: [],
    year: new Date().getFullYear(),
    status: 'available',
  });

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.title?.trim()) errors.push('Title is required');
    if (formData.title && (formData.title.length < 3 || formData.title.length > 200)) {
      errors.push('Title must be between 3 and 200 characters');
    }
    if (!formData.description?.trim()) errors.push('Description is required');
    if (formData.description && (formData.description.length < 10 || formData.description.length > 2000)) {
      errors.push('Description must be between 10 and 2000 characters');
    }
    if (!formData.year) errors.push('Year is required');
    if (formData.year) {
      const maxYear = new Date().getFullYear() + 1;
      if (formData.year < 1950 || formData.year > maxYear) {
        errors.push('Year must be between 1950 and next year');
      }
    }
    if (formData.price !== undefined && formData.price !== null && formData.price < 0) {
      errors.push('Price must be a positive number');
    }
    if (!formData.images || formData.images.length === 0) {
      errors.push('Please add at least one image');
    }
    if (formData.images && formData.images.length > MAX_IMAGES) {
      errors.push(`Maximum ${MAX_IMAGES} images allowed`);
    }

    return errors;
  };

  const getErrorMessage = (error: unknown) => {
    if (error instanceof ApiError) {
      if (error.statusCode === 413 || error.code === 'IMAGE_TOO_LARGE') {
        return { title: 'Image too large', message: error.message };
      }
      if (error.code === 'VALIDATION_ERROR' && error.details) {
        const detailMessages = Object.values(error.details).join(', ');
        return { title: 'Validation error', message: detailMessages || error.message };
      }
      if (error.statusCode === 401) {
        return { title: 'Unauthorized', message: 'Session expired. Please login again.' };
      }
      if (error.statusCode === 429) {
        return { title: 'Too many requests', message: 'Please wait a moment and try again.' };
      }
      if (error.statusCode >= 500) {
        return { title: 'Server error', message: 'Something went wrong. Please try again.' };
      }
      return { title: error.code || 'Error', message: error.message || 'Request failed' };
    }

    if (error instanceof Error) {
      return { title: 'Error', message: error.message };
    }

    return { title: 'Error', message: 'Failed to update product' };
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_IMAGES - formData.images.length;
    if (remainingSlots <= 0) {
      toast.warning(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    if (files.length > remainingSlots) {
      toast.warning(`Only ${remainingSlots} image(s) will be added (max ${MAX_IMAGES})`);
    }

    // Convert files to base64
    const newImages: string[] = [];
    let hasLargeImages = false;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (newImages.length >= remainingSlots) break;
      if (!file.type.startsWith('image/')) {
        toast.warning(`${file.name} is not an image file`, 'Invalid File');
        continue;
      }

      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > MAX_FILE_SIZE_MB) {
        toast.warning(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB and was skipped`, 'File too large');
        continue;
      }
      if (sizeInMB > COMPRESS_NOTICE_MB) {
        hasLargeImages = true;
      }
      
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newImages.push(base64);
    }

    if (newImages.length > 0) {
      setFormData({
        ...formData,
        images: [...formData.images, ...newImages],
      });
      toast.success(`${newImages.length} image(s) uploaded successfully`);
      if (hasLargeImages) {
        toast.info('Large images will be compressed automatically during upload');
      }
    }

    e.target.value = '';
  };

  useEffect(() => {
    // Load product data
    const loadProduct = async () => {
      try {
        const product = getProductById(productId);
        
        if (product) {
          setFormData({
            title: product.title,
            description: product.description,
            images: product.images,
            year: product.year,
            price: product.price,
            status: product.status,
          });
        } else {
          toast.error('Product not found');
          router.push('/admin/products');
        }
      } catch (error) {
        toast.error('Failed to load product');
        router.push('/admin/products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0], 'Validation error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Clean the data - remove null/undefined optional fields
      const cleanData = {
        title: formData.title,
        description: formData.description,
        images: formData.images,
        year: formData.year,
        status: formData.status,
        ...(formData.price !== null && formData.price !== undefined && { price: formData.price })
      };
      
      console.log('Submitting product update with data:', cleanData);
      await updateProduct(productId, cleanData);
      toast.success('Product updated successfully!');
      
      // Wait a moment for user to see the success message
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    } catch (error: any) {
      console.error('Error updating product:', error);
      const { title, message } = getErrorMessage(error);
      toast.error(message, title);
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-green-600 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Product</h1>
        <p className="text-gray-600">Update product details</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Main Form - Same as New Product */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Product Information</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                min="1950"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (Optional)
              </label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : undefined })}
                min="0"
                step="1000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="available"
                    checked={formData.status === 'available'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'available' })}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="sold"
                    checked={formData.status === 'sold'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'sold' })}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Sold</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Product Images</h2>

          {/* Upload Images */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <FaImage className="mx-auto text-gray-400 text-3xl mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Click to upload images</p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB each (auto-compressed)</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              You can select multiple images at once. Works on all devices (computer, Android, iOS).
            </p>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash size={12} />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            <FaTimes />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
