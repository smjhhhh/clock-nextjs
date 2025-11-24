-- Insert 'I''m Not The Only One' by Sam Smith
-- Preview URL and Cover Art fetched from iTunes API

INSERT INTO songs (
  title,
  artist,
  album,
  cover_url,
  audio_url,
  duration,
  color,
  dark_color,
  lyrics
) VALUES (
  'I''m Not The Only One',
  'Sam Smith',
  'In the Lonely Hour',
  'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/80/74/b6/8074b6bc-387f-6cc9-5ede-92b76396ad5f/13UAEIM58958.rgb.jpg/600x600bb.jpg',
  'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f8/6a/f6/f86af69d-8fd3-8a3b-2422-97d3db0cd450/mzaf_7581894648107667617.plus.aac.p.m4a',
  239, -- Full duration is 3:59 (239s), though preview is 30s
  '#4b5563', -- Gray 600
  '#1f2937', -- Gray 800
  'You and me, we made a vow\nFor better or for worse\nI can''t believe you let me down\nBut the proof''s in the way it hurts\nFor months on end I''ve had my doubts\nDenying every tear\nI wish this would be over now\nBut I know that I still need you here\n\nYou say I''m crazy\n''Cause you don''t think I know what you''ve done\nBut when you call me baby\nI know I''m not the only one'
);
