import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let question: string = ''
  let answerOptions: any[] = []

  try {
    // 先读取 request body，这样在 catch 块中也能访问
    const body = await request.json()
    question = body.question
    answerOptions = body.answerOptions

    // 调用 Ollama API
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen2.5:latest', // 你可以修改为你本地的模型
        prompt: `请将以下 MBTI 测试问题改写为不同但含义相同的表述。保持问题的核心意思不变，只是换一种说法。

原问题：${question}
选项 A：${answerOptions[0].answer}
选项 B：${answerOptions[1].answer}

请按以下格式输出（只输出JSON，不要其他内容）：
{
  "question": "改写后的问题",
  "optionA": "改写后的选项A",
  "optionB": "改写后的选项B"
}`,
        stream: false,
      }),
    })

    if (!ollamaResponse.ok) {
      throw new Error('Ollama API 调用失败')
    }

    const data = await ollamaResponse.json()
    const responseText = data.response

    // 尝试解析 JSON 响应
    try {
      // 提取 JSON 部分
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const rewritten = JSON.parse(jsonMatch[0])
        return NextResponse.json({
          question: rewritten.question,
          answerOptions: [
            {
              ...answerOptions[0],
              answer: rewritten.optionA,
            },
            {
              ...answerOptions[1],
              answer: rewritten.optionB,
            },
          ],
        })
      }
    } catch (parseError) {
      console.error('解析 Ollama 响应失败:', parseError)
    }

    // 如果解析失败，返回原始问题
    return NextResponse.json({
      question,
      answerOptions,
    })
  } catch (error) {
    console.error('Ollama API 错误:', error)
    // 如果 Ollama 不可用，返回原始问题
    return NextResponse.json({
      question,
      answerOptions,
    })
  }
}
