-- Add new columns for Smart Album features to the photos table

-- Enable PostGIS if not already enabled (optional, but good for advanced geo queries later)
-- create extension if not exists postgis;

ALTER TABLE photos 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS taken_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS latitude FLOAT,
ADD COLUMN IF NOT EXISTS longitude FLOAT,
ADD COLUMN IF NOT EXISTS location_name TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS camera_make TEXT,
ADD COLUMN IF NOT EXISTS camera_model TEXT,
ADD COLUMN IF NOT EXISTS lens_model TEXT,
ADD COLUMN IF NOT EXISTS focal_length FLOAT,
ADD COLUMN IF NOT EXISTS aperture FLOAT,
ADD COLUMN IF NOT EXISTS iso INTEGER,
ADD COLUMN IF NOT EXISTS exposure_time TEXT;

-- Create an index on taken_at for faster sorting/filtering by date
CREATE INDEX IF NOT EXISTS idx_photos_taken_at ON photos(taken_at);

-- Create an index on tags for faster searching
CREATE INDEX IF NOT EXISTS idx_photos_tags ON photos USING GIN(tags);

-- Create a spatial index if we were using PostGIS geometry, but for simple lat/long float, standard btree is okay for simple range queries, 
-- or we can just index them individually if needed. For now, let's keep it simple.
