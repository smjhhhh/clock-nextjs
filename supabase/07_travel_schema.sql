-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  cover_image_url TEXT,
  status TEXT CHECK (status IN ('planned', 'completed')) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add trip_id to photos table
ALTER TABLE photos ADD COLUMN IF NOT EXISTS trip_id UUID REFERENCES trips(id) ON DELETE SET NULL;

-- Enable RLS on trips
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trips
-- Public can view trips
CREATE POLICY "Public can view trips" ON trips
  FOR SELECT
  USING (true);

-- Authenticated users (admins) can insert
CREATE POLICY "Authenticated users can insert trips" ON trips
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users (admins) can update
CREATE POLICY "Authenticated users can update trips" ON trips
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated users (admins) can delete
CREATE POLICY "Authenticated users can delete trips" ON trips
  FOR DELETE
  USING (auth.role() = 'authenticated');
