import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * 提交 MBTI 测试答案并计算结果
 * POST /api/mbti/submit-answers
 * 
 * Request body:
 * {
 *   sessionId: string,
 *   answers: Array<{
 *     questionId: string,
 *     optionId: string,
 *     questionNumber: number
 *   }>
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   result: {
 *     mbtiType: string,
 *     scores: {
 *       introvert: number,
 *       sensing: number,
 *       thinking: number,
 *       perceiving: number,
 *       turbulent: number
 *     }
 *   }
 * }
 */
export async function POST(request: Request) {
  try {
    const { sessionId, answers } = await request.json()

    if (!sessionId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 1. 批量插入答案
    const answerRecords = answers.map((ans, index) => ({
      session_id: sessionId,
      question_id: ans.questionId,
      selected_option_id: ans.optionId,
      question_order: ans.questionNumber || index + 1
    }))

    const { error: insertError } = await supabase
      .from('user_answers')
      .insert(answerRecords)

    if (insertError) {
      console.error('插入答案失败:', insertError)
      return NextResponse.json(
        { error: '保存答案失败', details: insertError.message },
        { status: 500 }
      )
    }

    // 2. 计算得分
    // 获取所有答案及其对应的选项信息
    const { data: answersWithScores, error: scoresError } = await supabase
      .from('user_answers')
      .select(`
        question_id,
        selected_option_id,
        question_options!inner (
          score_value
        ),
        question_bank!inner (
          dimension
        )
      `)
      .eq('session_id', sessionId)

    if (scoresError) {
      console.error('获取得分失败:', scoresError)
      return NextResponse.json(
        { error: '计算得分失败', details: scoresError.message },
        { status: 500 }
      )
    }

    // 3. 计算各维度得分
    const scores = {
      introvert: 50,
      sensing: 50,
      thinking: 50,
      perceiving: 50,
      turbulent: 50
    }

    // 根据维度累加得分
    answersWithScores?.forEach((answer: any) => {
      const dimension = answer.question_bank.dimension
      const scoreValue = answer.question_options.score_value

      switch (dimension) {
        case 'EI':
          scores.introvert += scoreValue
          break
        case 'SN':
          scores.sensing += scoreValue
          break
        case 'TF':
          scores.thinking += scoreValue
          break
        case 'JP':
          scores.perceiving += scoreValue
          break
        case 'AT':
          scores.turbulent += scoreValue
          break
      }
    })

    // 确保得分在 0-100 范围内
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] = Math.max(0, Math.min(100, scores[key as keyof typeof scores]))
    })

    // 4. 计算 MBTI 类型
    const mbtiType = 
      (scores.introvert > 50 ? 'I' : 'E') +
      (scores.sensing > 50 ? 'S' : 'N') +
      (scores.thinking > 50 ? 'T' : 'F') +
      (scores.perceiving > 50 ? 'P' : 'J') +
      (scores.turbulent > 50 ? '-T' : '-A')

    // 5. 更新会话记录
    const { error: updateError } = await supabase
      .from('user_test_sessions')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        total_introvert: scores.introvert,
        total_sensing: scores.sensing,
        total_thinking: scores.thinking,
        total_perceiving: scores.perceiving,
        total_turbulent: scores.turbulent,
        mbti_type: mbtiType
      })
      .eq('id', sessionId)

    if (updateError) {
      console.error('更新会话失败:', updateError)
      // 不返回错误，因为答案已经保存成功
    }

    return NextResponse.json({
      success: true,
      result: {
        mbtiType,
        scores
      }
    })
  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
