'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import EXIF from 'exif-js'

interface ExifData {
  make?: string
  model?: string
  dateTime?: string
  exposureTime?: string
  fNumber?: number
  iso?: number
  focalLength?: number
  gpsLatitude?: number
  gpsLongitude?: number
  imageWidth?: number
  imageHeight?: number
}

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: () => void
}

// Helper to convert GPS coordinates
const convertDMSToDD = (dms: number[], ref: string): number => {
  const degrees = dms[0]
  const minutes = dms[1]
  const seconds = dms[2]
  let dd = degrees + minutes / 60 + seconds / 3600
  if (ref === 'S' || ref === 'W') {
    dd = dd * -1
  }
  return dd
}

// Extract EXIF data from file
const extractExifData = (file: File): Promise<ExifData> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function(e) {
      const img = new Image()
      img.onload = function() {
        EXIF.getData(img as unknown as string, function(this: HTMLImageElement) {
          const exifData: ExifData = {
            make: EXIF.getTag(this, 'Make') as string | undefined,
            model: EXIF.getTag(this, 'Model') as string | undefined,
            dateTime: (EXIF.getTag(this, 'DateTimeOriginal') || EXIF.getTag(this, 'DateTime')) as string | undefined,
            exposureTime: (EXIF.getTag(this, 'ExposureTime') as { toString(): string } | undefined)?.toString(),
            fNumber: EXIF.getTag(this, 'FNumber') as number | undefined,
            iso: EXIF.getTag(this, 'ISOSpeedRatings') as number | undefined,
            focalLength: EXIF.getTag(this, 'FocalLength') as number | undefined,
            imageWidth: (EXIF.getTag(this, 'PixelXDimension') || EXIF.getTag(this, 'ImageWidth')) as number | undefined,
            imageHeight: (EXIF.getTag(this, 'PixelYDimension') || EXIF.getTag(this, 'ImageHeight')) as number | undefined,
          }

          // Extract GPS data if available
          const gpsLatitude = EXIF.getTag(this, 'GPSLatitude') as number[] | undefined
          const gpsLatitudeRef = EXIF.getTag(this, 'GPSLatitudeRef') as string | undefined
          const gpsLongitude = EXIF.getTag(this, 'GPSLongitude') as number[] | undefined
          const gpsLongitudeRef = EXIF.getTag(this, 'GPSLongitudeRef') as string | undefined

          if (gpsLatitude && gpsLatitudeRef) {
            exifData.gpsLatitude = convertDMSToDD(gpsLatitude, gpsLatitudeRef)
          }
          if (gpsLongitude && gpsLongitudeRef) {
            exifData.gpsLongitude = convertDMSToDD(gpsLongitude, gpsLongitudeRef)
          }

          resolve(exifData)
        })
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isPublic, setIsPublic] = useState(false) // Default private
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    multiple: true
  })

  if (!isOpen) return null

  const uploadPhoto = async (file: File) => {
    try {
      // Check auth status
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not logged in, please login again')
      }

      // 1. Extract EXIF data BEFORE compression
      const exifData = await extractExifData(file)
      console.log('Extracted EXIF data:', exifData)

      // 2. Compress image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      })

      // 3. Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${session.user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

      // 4. Upload to Supabase Storage
      const { error: storageError } = await supabase
        .storage
        .from('photos')
        .upload(fileName, compressedFile)

      if (storageError) throw storageError

      // 5. Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('photos')
        .getPublicUrl(fileName)

      // 6. Save to database with EXIF metadata
      const { data, error } = await supabase
        .from('photos')
        .insert({
          user_id: session.user.id,
          image_url: publicUrl,
          title: title || file.name,
          description: description || '',
          is_public: isPublic,
          created_at: new Date().toISOString(),
          // EXIF metadata
          camera_make: exifData.make || null,
          camera_model: exifData.model || null,
          taken_at: exifData.dateTime || null,
          exposure_time: exifData.exposureTime || null,
          f_number: exifData.fNumber || null,
          iso: exifData.iso || null,
          focal_length: exifData.focalLength || null,
          gps_latitude: exifData.gpsLatitude || null,
          gps_longitude: exifData.gpsLongitude || null,
          image_width: exifData.imageWidth || null,
          image_height: exifData.imageHeight || null
        })
        .select()

      if (error) {
        console.error('Database insert error:', error)
        throw error
      }
      return data[0]
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select photos first')
      return
    }

    setUploading(true)
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        await uploadPhoto(selectedFiles[i])
        setUploadProgress(((i + 1) / selectedFiles.length) * 100)
      }
      alert('Upload successful!')
      onUploadSuccess()
      handleClose()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      alert('Upload failed: ' + errorMessage)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleClose = () => {
    setSelectedFiles([])
    setTitle('')
    setDescription('')
    setIsPublic(false)
    setUploadProgress(0)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upload Photos
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            disabled={uploading}
          >
            ✕
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-pink-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-gray-600 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {isDragActive ? (
              <p className="text-lg font-medium">Drop to upload</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-1">Drag photos here or click to select</p>
                <p className="text-sm">Supports PNG, JPG, GIF, WEBP</p>
              </>
            )}
          </div>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Selected {selectedFiles.length} photos
            </h3>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photo Info */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              placeholder="Add a title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              placeholder="Add description"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                {isPublic ? '🌍 Public Photo' : '🔒 Private Photo'}
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {isPublic ? 'Everyone can see this photo' : 'Only you can see this photo'}
              </p>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublic ? 'bg-pink-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
              <span className="text-gray-600 dark:text-gray-400">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="flex-1 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} photos`}
          </button>
        </div>
      </div>
    </div>
  )
}
