import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function checkNegative(text: string): Promise<boolean> {
  if (!text.trim()) return false
  try {
    const res = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{
        role: 'user',
        content: `以下の宿泊施設レビューにネガティブな表現・批判・不満・クレームが含まれますか？「はい」か「いいえ」のみ答えてください。\n\n"${text}"`,
      }],
    })
    const answer = (res.content[0] as { text: string }).text.trim()
    return answer.includes('はい')
  } catch {
    return false
  }
}
