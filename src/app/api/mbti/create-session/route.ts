import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * 创建一个新的 MBTI 测试会话
 * POST /api/mbti/create-session
 * 
 * Request body (可选):
 * {
 *   userId?: string,
 *   configId?: string
 * }
 * 
 * Response:
 * {
 *   sessionId: string,
 *   questions: Question[]
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { userId = null, configId = null } = body

    // 调用数据库函数创建测试会话
    const { data: sessionId, error: sessionError } = await supabase
      .rpc('create_test_session', {
        p_user_id: userId,
        p_config_id: configId
      })

    if (sessionError) {
      console.error('创建会话失败:', sessionError)
      return NextResponse.json(
        { error: '创建测试会话失败', details: sessionError.message },
        { status: 500 }
      )
    }

    // 获取抽取的题目
    const { data: questionsData, error: questionsError } = await supabase
      .rpc('get_test_questions', {
        p_session_id: sessionId
      })

    if (questionsError) {
      console.error('获取题目失败:', questionsError)
      return NextResponse.json(
        { error: '获取题目失败', details: questionsError.message },
        { status: 500 }
      )
    }

    const questions = questionsData || []

    return NextResponse.json({
      sessionId,
      questions,
      totalQuestions: questions.length
    })
  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
