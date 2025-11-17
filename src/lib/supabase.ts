import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for database tables
export interface Photo {
  id: string
  user_id: string
  title: string | null
  description: string | null
  image_url: string
  thumbnail_url: string | null
  is_public: boolean
  taken_at: string | null
  location: string | null
  tags: string[] | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  created_at: string
}
