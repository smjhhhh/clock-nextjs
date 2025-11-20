'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'
import EXIF from 'exif-js'
import { FaCloudUploadAlt, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa'

export default function PhotoUpload({ onUploadComplete }: { onUploadComplete: () => void }) {
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const extractMetadata = (file: File): Promise<any> => {
        return new Promise((resolve) => {
            EXIF.getData(file as any, function (this: any) {
                const allTags = EXIF.getAllTags(this)
                resolve(allTags)
            })
        })
    }

    const convertDMSToDD = (degrees: number, minutes: number, seconds: number, direction: string) => {
        let dd = degrees + minutes / 60 + seconds / (60 * 60)
        if (direction === 'S' || direction === 'W') {
            dd = dd * -1
        }
        return dd
    }

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setUploading(true)
        setMessage(null)

        try {
            for (const file of acceptedFiles) {
                // 1. Extract Metadata
                const metadata = await extractMetadata(file)
                console.log('Extracted Metadata:', metadata)

                let latitude = null
                let longitude = null
                let takenAt = null

                // Parse GPS
                if (metadata.GPSLatitude && metadata.GPSLongitude) {
                    const latRef = metadata.GPSLatitudeRef || 'N'
                    const longRef = metadata.GPSLongitudeRef || 'E'
                    latitude = convertDMSToDD(
                        metadata.GPSLatitude[0],
                        metadata.GPSLatitude[1],
                        metadata.GPSLatitude[2],
                        latRef
                    )
                    longitude = convertDMSToDD(
                        metadata.GPSLongitude[0],
                        metadata.GPSLongitude[1],
                        metadata.GPSLongitude[2],
                        longRef
                    )
                }

                // Parse Date
                if (metadata.DateTimeOriginal) {
                    // Format: "YYYY:MM:DD HH:MM:SS"
                    const [datePart, timePart] = metadata.DateTimeOriginal.split(' ')
                    const [year, month, day] = datePart.split(':')
                    takenAt = new Date(`${year}-${month}-${day}T${timePart}`).toISOString()
                }

                // 2. Upload to Storage
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('photos')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                // 3. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('photos')
                    .getPublicUrl(filePath)

                // 4. Insert into Database
                const { error: dbError } = await supabase
                    .from('photos')
                    .insert({
                        image_url: publicUrl,
                        title: file.name,
                        is_public: true,
                        metadata: metadata,
                        taken_at: takenAt,
                        latitude: latitude,
                        longitude: longitude,
                        camera_make: metadata.Make,
                        camera_model: metadata.Model,
                        exposure_time: metadata.ExposureTime ? String(metadata.ExposureTime) : null,
                        focal_length: metadata.FocalLength ? Number(metadata.FocalLength) : null,
                        iso: metadata.ISOSpeedRatings ? Number(metadata.ISOSpeedRatings) : null,
                        aperture: metadata.FNumber ? Number(metadata.FNumber) : null,
                    })

                if (dbError) throw dbError
            }

            setMessage({ type: 'success', text: 'Photos uploaded successfully!' })
            onUploadComplete()
        } catch (error: any) {
            console.error('Upload failed:', error)
            setMessage({ type: 'error', text: error.message || 'Upload failed' })
        } finally {
            setUploading(false)
        }
    }, [onUploadComplete])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.heic']
        }
    })

    return (
        <div className="w-full max-w-xl mx-auto mb-8">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }
        `}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <div className="flex flex-col items-center justify-center text-blue-500">
                        <FaSpinner className="animate-spin text-3xl mb-2" />
                        <p>Processing & Uploading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <FaCloudUploadAlt className="text-4xl mb-2" />
                        <p className="text-lg font-medium">
                            {isDragActive ? 'Drop photos here...' : 'Drag & drop photos here, or click to select'}
                        </p>
                        <p className="text-sm mt-1">Supports JPG, PNG with EXIF data</p>
                    </div>
                )}
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center ${message.type === 'success'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                    {message.type === 'success' ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />}
                    {message.text}
                </div>
            )}
        </div>
    )
}
