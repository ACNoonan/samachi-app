import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface VenueImageUploadProps {
  venueId: string
  currentImageUrl?: string
  onImageUploaded: (url: string) => void
}

export function VenueImageUpload({ venueId, currentImageUrl, onImageUploaded }: VenueImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClientComponentClient()

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${venueId}-${Math.random()}.${fileExt}`

      // Upload image to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('venue-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('venue-images')
        .getPublicUrl(filePath)

      // Update venue record with new image URL
      const { error: updateError } = await supabase
        .from('venues')
        .update({
          image_url: publicUrl,
          image_bucket_path: filePath
        })
        .eq('id', venueId)

      if (updateError) {
        throw updateError
      }

      onImageUploaded(publicUrl)
      toast.success('Venue image updated successfully')
    } catch (error) {
      toast.error('Error uploading image')
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="image">Venue Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={uploadImage}
          disabled={uploading}
        />
      </div>
      {currentImageUrl && (
        <div className="relative w-full max-w-sm aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImageUrl}
            alt="Venue"
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  )
} 