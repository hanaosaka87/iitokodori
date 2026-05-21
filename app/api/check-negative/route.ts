import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { text } = await req.json()
  if (!text?.trim()) return NextResponse.json({ isNegative: false })
  try {
    const res = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{
        role: 'user',
        content: `宿泊施設のレビューとして、以下にネガティブ・批判・不満・クレームが含まれますか？「はい」か「いいえ」のみ答えてください。\n"${text}"`,
      }],
    })
    const answer = (res.content[0] as { text: string }).text.trim()
    return NextResponse.json({ isNegative: answer.includes('はい') })
  } catch {
    return NextResponse.json({ isNegative: false })
  }
}
