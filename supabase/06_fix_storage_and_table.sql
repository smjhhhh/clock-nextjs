-- Comprehensive fix for Photos feature
-- 1. Create photos table if it doesn't exist
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Smart Album Fields
  metadata JSONB DEFAULT '{}'::jsonb,
  taken_at TIMESTAMPTZ,
  latitude FLOAT,
  longitude FLOAT,
  location_name TEXT,
  tags TEXT[] DEFAULT '{}',
  camera_make TEXT,
  camera_model TEXT,
  lens_model TEXT,
  focal_length FLOAT,
  aperture FLOAT,
  iso INTEGER,
  exposure_time TEXT
);

-- 2. Enable RLS on photos table
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for photos table
DROP POLICY IF EXISTS "Public photos are viewable by everyone" ON photos;
CREATE POLICY "Public photos are viewable by everyone"
  ON photos FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS "Authenticated users can view all photos" ON photos;
CREATE POLICY "Authenticated users can view all photos"
  ON photos FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can upload photos" ON photos;
CREATE POLICY "Authenticated users can upload photos"
  ON photos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update photos" ON photos;
CREATE POLICY "Authenticated users can update photos"
  ON photos FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete photos" ON photos;
CREATE POLICY "Authenticated users can delete photos"
  ON photos FOR DELETE
  USING (auth.role() = 'authenticated');

-- 4. Create Storage Bucket 'photos'
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Create Storage Policies
-- Allow public access to view files
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'photos' );

-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'photos' AND auth.role() = 'authenticated' );

-- Allow authenticated users to delete files
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
CREATE POLICY "Authenticated Delete"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'photos' AND auth.role() = 'authenticated' );
