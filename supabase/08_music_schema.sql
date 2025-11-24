-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  cover_url TEXT,
  audio_url TEXT NOT NULL,
  duration INTEGER, -- Duration in seconds
  color TEXT DEFAULT '#60a5fa',
  dark_color TEXT DEFAULT '#1d4ed8',
  lyrics TEXT, -- Stored as plain text or JSON string
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view songs" ON songs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert songs" ON songs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update songs" ON songs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete songs" ON songs FOR DELETE USING (auth.role() = 'authenticated');

-- Storage Bucket for Music
INSERT INTO storage.buckets (id, name, public) 
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Music Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'music');
CREATE POLICY "Music Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'music' AND auth.role() = 'authenticated');
CREATE POLICY "Music Auth Update" ON storage.objects FOR UPDATE USING (bucket_id = 'music' AND auth.role() = 'authenticated');
CREATE POLICY "Music Auth Delete" ON storage.objects FOR DELETE USING (bucket_id = 'music' AND auth.role() = 'authenticated');
