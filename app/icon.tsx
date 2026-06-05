import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: '#f59e0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22">
          {/* 顔の輪郭 */}
          <circle cx="11" cy="11" r="10" fill="#fff8e1" stroke="#fff" strokeWidth="0.5" />
          {/* 左目 */}
          <circle cx="7.5" cy="9" r="1.5" fill="#5d4037" />
          {/* 右目 */}
          <circle cx="14.5" cy="9" r="1.5" fill="#5d4037" />
          {/* 笑顔 */}
          <path
            d="M 6.5 13 Q 11 17.5 15.5 13"
            stroke="#5d4037"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* ほっぺ（左） */}
          <circle cx="6" cy="13" r="2" fill="#ffb74d" opacity="0.5" />
          {/* ほっぺ（右） */}
          <circle cx="16" cy="13" r="2" fill="#ffb74d" opacity="0.5" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
