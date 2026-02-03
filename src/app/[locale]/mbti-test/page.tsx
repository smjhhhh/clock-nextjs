'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/navigation'

// 类型定义
interface AnswerOption {
  id: string
  answer: string
  scoreValue: number
}

interface Question {
  id: string
  question: string
  dimension: string
  questionNumber: number
  answerOptions: AnswerOption[]
}

interface UserAnswer {
  questionId: string
  optionId: string
  questionNumber: number
}

export default function MBTITestPage() {
  const [sessionId, setSessionId] = useState<string>('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<UserAnswer[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<{
    mbtiType: string
    scores: {
      introvert: number
      sensing: number
      thinking: number
      perceiving: number
      turbulent: number
    }
  } | null>(null)

  // 加载题目
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/api/mbti/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })

        if (!response.ok) {
          throw new Error('获取题目失败')
        }

        const data = await response.json()
        setSessionId(data.sessionId)
        setQuestions(data.questions)
      } catch (error) {
        console.error('加载题目失败:', error)
        alert('加载题目失败，请刷新页面重试')
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [])

  // 答题处理
  const handleAnswer = (option: AnswerOption) => {
    const question = questions[currentQuestion]
    const newAnswer: UserAnswer = {
      questionId: question.id,
      optionId: option.id,
      questionNumber: question.questionNumber
    }

    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // 测试完成，提交答案
      submitAnswers(newAnswers)
    }
  }

  // 提交答案
  const submitAnswers = async (finalAnswers: UserAnswer[]) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/mbti/submit-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answers: finalAnswers
        })
      })

      if (!response.ok) {
        throw new Error('提交答案失败')
      }

      const data = await response.json()
      setResult(data.result)
      setShowResult(true)
    } catch (error) {
      console.error('提交答案失败:', error)
      alert('提交答案失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 重新开始
  const restart = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
    setResult(null)
    setIsLoading(true)
    
    // 重新加载题目
    window.location.reload()
  }

  // MBTI 分组颜色
  const getMBTIGroupColor = (type: string) => {
    if (!type || type.length < 4) return { group: '', color: '', badge: '', text: '' }
    
    const secondChar = type[1]
    const thirdChar = type[2]
    
    // 分析师 (NT): 紫色系
    if (secondChar === 'N' && thirdChar === 'T') {
      return {
        group: '分析师',
        color: 'from-purple-600 to-indigo-600',
        badge: 'bg-purple-100 text-purple-700 border-purple-300',
        text: 'text-purple-600'
      }
    }
    
    // 外交家 (NF): 绿色系
    if (secondChar === 'N' && thirdChar === 'F') {
      return {
        group: '外交家',
        color: 'from-green-500 to-emerald-500',
        badge: 'bg-green-100 text-green-700 border-green-300',
        text: 'text-green-600'
      }
    }
    
    // 守卫者 (SJ): 蓝色系
    if (secondChar === 'S' && type[3] === 'J') {
      return {
        group: '守卫者',
        color: 'from-blue-500 to-cyan-500',
        badge: 'bg-blue-100 text-blue-700 border-blue-300',
        text: 'text-blue-600'
      }
    }
    
    // 探险家 (SP): 橙色系
    if (secondChar === 'S' && type[3] === 'P') {
      return {
        group: '探险家',
        color: 'from-orange-500 to-amber-500',
        badge: 'bg-orange-100 text-orange-700 border-orange-300',
        text: 'text-orange-600'
      }
    }
    
    return { group: '', color: '', badge: '', text: '' }
  }

  // 结果页面
  if (showResult && result) {
    const mbtiType = result.mbtiType
    const groupInfo = getMBTIGroupColor(mbtiType)

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${groupInfo.badge}`}>
                  {groupInfo.group}
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-4">
                <span className={`bg-gradient-to-r ${groupInfo.color} bg-clip-text text-transparent`}>
                  {mbtiType}
                </span>
              </h1>
              <p className="text-xl text-gray-600">你的 MBTI 性格类型</p>
            </div>

            {/* 得分详情 */}
            <div className="space-y-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">详细得分</h2>
              
              <div className="space-y-4">
                {/* EI 维度 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>外向 (E)</span>
                    <span className="font-semibold">{result.scores.introvert}%</span>
                    <span>内向 (I)</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-purple-400 transition-all" 
                      style={{ width: `${result.scores.introvert}%` }}
                    ></div>
                  </div>
                </div>

                {/* SN 维度 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>实感 (S)</span>
                    <span className="font-semibold">{result.scores.sensing}%</span>
                    <span>直觉 (N)</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-indigo-400 transition-all" 
                      style={{ width: `${result.scores.sensing}%` }}
                    ></div>
                  </div>
                </div>

                {/* TF 维度 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>理性 (T)</span>
                    <span className="font-semibold">{result.scores.thinking}%</span>
                    <span>情感 (F)</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-pink-400 transition-all" 
                      style={{ width: `${result.scores.thinking}%` }}
                    ></div>
                  </div>
                </div>

                {/* JP 维度 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>计划 (J)</span>
                    <span className="font-semibold">{result.scores.perceiving}%</span>
                    <span>随性 (P)</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-400 to-violet-400 transition-all" 
                      style={{ width: `${result.scores.perceiving}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={restart}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                重新测试
              </button>
              <Link
                href="/about-me"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center"
              >
                查看我的主页
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 加载中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">正在准备测试...</h2>
          <p className="text-gray-600">
            从题库中随机抽取 20 道题目
          </p>
        </div>
      </div>
    )
  }

  // 答题页面
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">无法获取测试题目</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MBTI 性格测试</h1>
          <p className="text-gray-600 mb-4">探索你的性格类型</p>
          <div className="text-sm text-gray-500">
            题目 {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.answerOptions.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option)}
                className="w-full p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all hover:scale-102 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-all">
                    <span className="font-bold text-purple-600">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-gray-800 group-hover:text-gray-900 transition-colors">
                      {option.answer}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="px-6 py-3 bg-white/50 hover:bg-white/80 text-gray-700 font-semibold rounded-full transition-all"
          >
            返回首页
          </Link>
          <div className="text-sm text-gray-600">
            已完成 {answers.length} 题
          </div>
        </div>
      </div>
    </div>
  )
}
