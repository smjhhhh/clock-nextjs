-- 1. Create the Trip
WITH new_trip AS (
  INSERT INTO trips (title, description, start_date, end_date, status, cover_image_url)
  VALUES (
    '🌸 Sakura Season in Japan', 
    'A dream journey chasing cherry blossoms across Japan. From the neon lights of Tokyo to the traditional streets of Kyoto and the food paradise of Osaka. Highlights included wearing kimonos in Gion, seeing Mt. Fuji clearly, and eating way too much takoyaki.', 
    '2024-03-25', 
    '2024-04-08', 
    'completed',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop'
  )
  RETURNING id
)
-- 2. Insert Photos linked to this Trip
INSERT INTO photos (trip_id, title, description, image_url, is_public, taken_at, latitude, longitude, location_name, camera_make, camera_model, lens_model, iso, aperture, exposure_time)
SELECT 
  id as trip_id,
  title,
  description,
  image_url,
  true as is_public,
  taken_at::timestamp,
  latitude,
  longitude,
  location_name,
  'Sony',
  'A7IV',
  'FE 24-70mm GM II',
  100,
  2.8,
  '1/200'
FROM new_trip, (VALUES 
  (
    'Tokyo Tower at Night', 
    'The iconic landmark glowing in the dark.', 
    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=2036&auto=format&fit=crop',
    '2024-03-26 20:00:00',
    35.6586, 
    139.7454,
    'Minato City, Tokyo'
  ),
  (
    'Senso-ji Temple', 
    'Crowded but beautiful Asakusa.', 
    'https://images.unsplash.com/photo-1538097304804-2a1b932466a9?q=80&w=2070&auto=format&fit=crop',
    '2024-03-27 10:00:00',
    35.7148, 
    139.7967,
    'Asakusa, Tokyo'
  ),
  (
    'Mt. Fuji from Chureito Pagoda', 
    'The classic postcard shot. Worth the climb!', 
    'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=80&w=2070&auto=format&fit=crop',
    '2024-03-29 06:30:00',
    35.5011, 
    138.8017,
    'Fujiyoshida, Yamanashi'
  ),
  (
    'Fushimi Inari Taisha', 
    'Thousands of vermilion torii gates.', 
    'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?q=80&w=2070&auto=format&fit=crop',
    '2024-04-01 08:00:00',
    34.9671, 
    135.7727,
    'Fushimi Ward, Kyoto'
  ),
  (
    'Arashiyama Bamboo Grove', 
    'Walking through the soaring bamboo stalks.', 
    'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?q=80&w=1974&auto=format&fit=crop',
    '2024-04-02 07:00:00',
    35.0094, 
    135.6670,
    'Arashiyama, Kyoto'
  ),
  (
    'Dotonbori Neon Lights', 
    'The food kitchen of Japan. Glico man!', 
    'https://images.unsplash.com/photo-1590559899731-a38283956c8c?q=80&w=2070&auto=format&fit=crop',
    '2024-04-05 19:00:00',
    34.6687, 
    135.5013,
    'Dotonbori, Osaka'
  )
) AS t(title, description, image_url, taken_at, latitude, longitude, location_name);
