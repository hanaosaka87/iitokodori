'use client'

import { useState } from 'react'

type Props = {
  text: string
  url?: string
  onClose: () => void
}

const APP_URL = 'https://iitokodori.hana.trickster.biz'

// 投稿完了後にSNSへそのまま共有できるよう案内するモーダル
// （くま！おる！熊！のPostSuccessShare.tsxと同じパターンを横展開。2026-10-07）
export default function PostSuccessShare({ text, url = APP_URL, onClose }: Props) {
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const copyAndOpen = async (href: string, platformName: string) => {
    try {
      await navigator.clipboard.writeText(text + '\n' + url)
      showToast(`テキストをコピーしました。${platformName}に貼り付けて投稿しよう！`)
    } catch {
      showToast(`${platformName}アプリを開きます`)
    }
    window.open(href, '_blank')
  }

  const encoded = encodeURIComponent(text)

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 px-0 sm:px-6"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-amber-700">🌸 投稿しました！</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition text-xl leading-none">✕</button>
        </div>
        <p className="text-gray-500 text-sm mb-4">良かった体験を、SNSでもシェアしませんか？</p>

        <p className="text-gray-500 text-xs mb-4 bg-amber-50 rounded-xl px-3 py-2 leading-relaxed">
          {text}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <button
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank')}
            className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl text-white transition bg-black hover:bg-zinc-800"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-xs font-medium">X</span>
          </button>
          <button
            onClick={() => window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text + '\n' + url)}`, '_blank')}
            className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl text-white transition bg-[#06C755] hover:bg-[#05b34c]"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            <span className="text-xs font-medium">LINE</span>
          </button>
          <button
            onClick={() => copyAndOpen('https://www.instagram.com', 'Instagram')}
            className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl text-white transition bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
            <span className="text-xs font-medium">Instagram</span>
          </button>
        </div>

        {toast && (
          <div className="bg-amber-100 text-amber-800 text-xs text-center rounded-xl px-3 py-2 mb-3 font-bold">
            {toast}
          </div>
        )}

        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text + '\n' + url)
              showToast('コピーしました！')
            } catch {}
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-50 hover:opacity-80 text-amber-800 text-sm transition"
        >
          🔗 リンク＋テキストをコピー
        </button>
        <button onClick={onClose} className="w-full text-center text-gray-400 text-xs mt-3">
          あとで（このまま閉じる）
        </button>
      </div>
    </div>
  )
}
