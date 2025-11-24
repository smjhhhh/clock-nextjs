-- Insert a dummy trip
INSERT INTO trips (title, description, start_date, end_date, status, cover_image_url)
VALUES (
  'Japan Adventure', 
  'A wonderful journey through Tokyo, Kyoto, and Osaka.', 
  '2024-04-01', 
  '2024-04-15', 
  'completed',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop'
);

-- Assign some photos to this trip (assuming there are photos, if not, this does nothing)
UPDATE photos SET trip_id = (SELECT id FROM trips WHERE title = 'Japan Adventure' LIMIT 1)
WHERE id IN (SELECT id FROM photos LIMIT 3);
