"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaTimes, FaImage, FaTrash, FaSpinner } from 'react-icons/fa';
import { ProductFormData } from '@/types';
import { useProducts } from '@/contexts/ProductsContext';
import { useToast } from '@/contexts/ToastContext';
import { ApiError } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';

const MAX_IMAGES = 10;
const MAX_FILE_SIZE_MB = 10;
const COMPRESS_NOTICE_MB = 5;

export default function NewProductPage() {
  const router = useRouter();
  const { createProduct } = useProducts();
  const toast = useToast();
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    images: [],
    year: new Date().getFullYear(),
    status: 'available',
  });

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.title?.trim()) errors.push(t('admin.validation.titleRequired'));
    if (formData.title && (formData.title.length < 3 || formData.title.length > 200)) {
      errors.push(t('admin.validation.titleLength'));
    }
    if (!formData.description?.trim()) errors.push(t('admin.validation.descRequired'));
    if (formData.description && (formData.description.length < 10 || formData.description.length > 2000)) {
      errors.push(t('admin.validation.descLength'));
    }
    if (!formData.year) errors.push(t('admin.validation.yearRequired'));
    if (formData.year) {
      const maxYear = new Date().getFullYear() + 1;
      if (formData.year < 1950 || formData.year > maxYear) {
        errors.push(t('admin.validation.yearRange'));
      }
    }
    if (formData.price !== undefined && formData.price !== null && formData.price < 0) {
      errors.push(t('admin.validation.pricePositive'));
    }
    if (!formData.images || formData.images.length === 0) {
      errors.push(t('admin.validation.imageRequired'));
    }
    if (formData.images && formData.images.length > MAX_IMAGES) {
      errors.push(t('admin.validation.imageMax', { max: MAX_IMAGES }));
    }

    return errors;
  };

  const getErrorMessage = (error: unknown) => {
    if (error instanceof ApiError) {
      if (error.statusCode === 413 || error.code === 'IMAGE_TOO_LARGE') {
        return { title: t('admin.errors.imageTooLarge'), message: error.message };
      }
      if (error.code === 'VALIDATION_ERROR' && error.details) {
        const detailMessages = Object.values(error.details).join(', ');
        return { title: t('admin.validation.validationError'), message: detailMessages || error.message };
      }
      if (error.statusCode === 401) {
        return { title: t('admin.errors.unauthorized'), message: t('admin.errors.sessionExpired') };
      }
      if (error.statusCode === 429) {
        return { title: t('admin.errors.tooMany'), message: t('admin.errors.tryAgain') };
      }
      if (error.statusCode >= 500) {
        return { title: t('admin.errors.serverError'), message: t('admin.errors.somethingWrong') };
      }
      return { title: error.code || t('admin.errors.requestFailed'), message: error.message || t('admin.errors.requestFailed') };
    }

    if (error instanceof Error) {
      return { title: t('admin.errors.requestFailed'), message: error.message };
    }

    return { title: t('admin.errors.requestFailed'), message: t('admin.errors.createFail') };
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_IMAGES - formData.images.length;
    if (remainingSlots <= 0) {
      toast.warning(t('admin.upload.maxImages', { max: MAX_IMAGES }));
      return;
    }

    if (files.length > remainingSlots) {
      toast.warning(t('admin.upload.remaining', { count: remainingSlots, max: MAX_IMAGES }));
    }

    // Convert files to base64
    const newImages: string[] = [];
    let hasLargeImages = false;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (newImages.length >= remainingSlots) break;
      if (!file.type.startsWith('image/')) {
        toast.warning(t('admin.upload.notImage', { name: file.name }), t('admin.upload.invalidFile'));
        continue;
      }

      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > MAX_FILE_SIZE_MB) {
        toast.warning(t('admin.upload.tooLarge', { name: file.name, max: MAX_FILE_SIZE_MB }), t('admin.upload.fileTooLarge'));
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
      toast.success(t('admin.upload.uploaded', { count: newImages.length }));
      if (hasLargeImages) {
        toast.info(t('admin.upload.compressInfo'));
      }
    }

    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0], t('admin.validation.validationError'));
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
      
      await createProduct(cleanData);
      toast.success(t('admin.form.createSuccess'));
      
      // Wait a moment for user to see the success message
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    } catch (error: any) {
      console.error('Error creating product:', error);
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

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('admin.form.addTitle')}</h1>
        <p className="text-gray-600">{t('admin.form.addSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Main Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{t('admin.form.info')}</h2>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.form.title')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder={t('admin.form.titlePlaceholder')}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.form.description')} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                placeholder={t('admin.form.descriptionPlaceholder')}
                required
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.form.year')} <span className="text-red-500">*</span>
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

            {/* Price (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.form.price')}
              </label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : undefined })}
                min="0"
                step="1000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder={t('admin.form.pricePlaceholder')}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.form.status')} <span className="text-red-500">*</span>
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
                  <span className="text-sm text-gray-700">{t('admin.form.available')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="sold"
                    checked={formData.status === 'sold'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'sold' })}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{t('admin.form.sold')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{t('admin.form.images')}</h2>

          {/* Upload Images */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.form.upload')}
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <FaImage className="mx-auto text-gray-400 text-3xl mb-2" />
                  <p className="text-sm text-gray-600 mb-1">{t('admin.form.uploadHint')}</p>
                  <p className="text-xs text-gray-500">{t('admin.form.uploadTypes')}</p>
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
              {t('admin.form.uploadNote')}
            </p>
          </div>

          {/* Image Previews */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`${t('admin.productsPage.table.product')} ${index + 1}`}
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

          {formData.images.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <FaImage className="mx-auto text-gray-400 mb-2" size={48} />
              <p className="text-gray-500">{t('admin.form.noImages')}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />
            {isSubmitting ? t('admin.form.creating') : t('admin.form.create')}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            <FaTimes />
            {t('admin.form.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
