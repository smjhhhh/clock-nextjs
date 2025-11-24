import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  }
})

// ==================== 类型定义 ====================

export type QuestionBank = {
  id: string
  question_text: string
  dimension: 'EI' | 'SN' | 'TF' | 'JP' | 'AT'
  difficulty: number
  weight: number
  usage_count: number
  is_active: boolean
  created_at: string
  updated_at: string
  metadata: Record<string, any> | null
}

export type QuestionOption = {
  id: string
  question_id: string
  option_text: string
  option_order: number
  score_value: number
  created_at: string
}

export type TestConfig = {
  id: string
  config_name: string
  questions_per_dimension: Record<string, number>
  total_questions: number
  selection_strategy: string
  is_default: boolean
  created_at: string
}

export type UserTestSession = {
  id: string
  user_id: string | null
  config_id: string | null
  started_at: string
  completed_at: string | null
  is_completed: boolean
  total_introvert: number
  total_sensing: number
  total_thinking: number
  total_perceiving: number
  total_turbulent: number
  mbti_type: string | null
  selected_questions: string[]
  session_data: Record<string, any> | null
}

export type UserAnswer = {
  id: string
  session_id: string
  question_id: string
  selected_option_id: string
  question_order: number
  answered_at: string
}

// ==================== 前端使用的类型 ====================

export type Question = {
  id: string
  question: string
  dimension: string
  questionNumber: number
  answerOptions: {
    id: string
    answer: string
    scoreValue: number
  }[]
}

export type TestResult = {
  mbtiType: string
  scores: {
    introvert: number
    sensing: number
    thinking: number
    perceiving: number
    turbulent: number
  }
}

export type BlogPost = {
  id: string
  title: string
  content: string
  author: string
  created_at: string
  image_url?: string
  summary?: string
}

export interface Trip {
  id: string
  title: string
  description?: string
  start_date?: string
  end_date?: string
  cover_image_url?: string
  status: 'planned' | 'completed'
  created_at: string
  updated_at: string
}

export type Photo = {
  id: string
  created_at: string
  image_url: string
  title?: string
  description?: string
  width?: number
  height?: number
  trip_id?: string
  taken_at?: string
  camera_model?: string
  latitude?: number
  longitude?: number
  location_name?: string
}

export interface Song {
  id: string
  title: string
  artist: string
  album: string
  cover_url: string
  audio_url: string
  duration: number
  color: string
  dark_color: string
  lyrics: string
  created_at: string
}
