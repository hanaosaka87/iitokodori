// いいとこどり 新アイコン（温泉旅情デザイン）からfavicon一式を生成
// 実行: node scripts/generate-icons.js
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const SOURCE = 'c:/dev/sns-automation/characters/いいとこどり 温泉旅情.png'
const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const APP_DIR = path.join(__dirname, '..', 'app')
const MASKABLE_BG = '#F97316' // manifest.jsonのtheme_colorと統一
const CORNER_RADIUS_RATIO = 0.23 // 原画の角丸比率（実測：対角85px/1254px地点で白→色に切替わる地点から逆算）

// 原画の四隅に残る白い余白（角丸の外側）を透明化する
async function clipRoundedCorners(buffer, size) {
  const r = Math.round(size * CORNER_RADIUS_RATIO)
  const maskSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/></svg>`
  )
  return sharp(buffer)
    .resize(size, size)
    .ensureAlpha()
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer()
}

// maskableアイコン用：OSが丸形等でマスクしても文字・花びらが切れないよう、
// セーフゾーン（中央80%の円）に収まる縮小率でブランドカラー背景の上に配置する
// 角丸半径23%の形状だと、角の先端が中心から約0.612×innerの位置に来るため、
// innerScale ≤ 0.4/0.612 ≈ 0.654 が理論上の上限。安全マージンを少し残し0.65を採用
async function buildMaskable(clipped, size) {
  const inner = Math.round(size * 0.65)
  const art = await sharp(clipped).resize(inner, inner).png().toBuffer()
  return sharp({
    create: { width: size, height: size, channels: 4, background: MASKABLE_BG },
  })
    .composite([{ input: art, gravity: 'center' }])
    .png()
    .toBuffer()
}

// 32x32 PNGを1枚だけ内包する最小構成のICOファイルを作る
function buildIco(pngBuffers) {
  // pngBuffers: [{ size, buf }]
  const count = pngBuffers.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type = icon
  header.writeUInt16LE(count, 4)

  let offset = 6 + count * 16
  const dirEntries = []
  const dataChunks = []
  for (const { size, buf } of pngBuffers) {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0) // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1) // height
    entry.writeUInt8(0, 2) // color count
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // planes
    entry.writeUInt16LE(32, 6) // bit count
    entry.writeUInt32LE(buf.length, 8) // bytes in res
    entry.writeUInt32LE(offset, 12) // image offset
    dirEntries.push(entry)
    dataChunks.push(buf)
    offset += buf.length
  }
  return Buffer.concat([header, ...dirEntries, ...dataChunks])
}

async function main() {
  // 白地マージンを除去し正方形にトリミング
  const trimmed = await sharp(SOURCE).trim().toBuffer()
  // 四隅の白い余白（角丸の外側）を透明化した「白縁なし」マスター画像
  const clipped = await clipRoundedCorners(trimmed, 1024)

  const icon512 = await sharp(clipped).resize(512, 512).png().toBuffer()
  const icon192 = await sharp(clipped).resize(192, 192).png().toBuffer()
  const appleTouch = await sharp(clipped).resize(180, 180).png().toBuffer()
  const favicon32 = await sharp(clipped).resize(32, 32).png().toBuffer()
  const favicon16 = await sharp(clipped).resize(16, 16).png().toBuffer()
  // ICOはRGBA形式のPNGを要求するため、アルファチャンネルを明示的に付与した別バッファを用意
  const favicon32Rgba = await sharp(clipped).resize(32, 32).ensureAlpha().png().toBuffer()
  const favicon16Rgba = await sharp(clipped).resize(16, 16).ensureAlpha().png().toBuffer()

  const maskable512 = await buildMaskable(clipped, 512)
  const maskable192 = await buildMaskable(clipped, 192)

  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-512.png'), icon512)
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-192.png'), icon192)
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-maskable-512.png'), maskable512)
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-maskable-192.png'), maskable192)
  fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), appleTouch)
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-32.png'), favicon32)

  const ico = buildIco([
    { size: 16, buf: favicon16Rgba },
    { size: 32, buf: favicon32Rgba },
  ])
  fs.writeFileSync(path.join(APP_DIR, 'favicon.ico'), ico)

  // トップページのヒーローバナー画像も同じ「白縁なし」マスターから作り直す
  const hero = await sharp(clipped).resize(640, 640).png({ quality: 90, compressionLevel: 9 }).toBuffer()
  fs.writeFileSync(path.join(PUBLIC_DIR, 'hero-iitokodori.png'), hero)

  console.log('✅ icon-512.png / icon-192.png / icon-maskable-512.png / icon-maskable-192.png / apple-touch-icon.png / favicon-32.png / app/favicon.ico / hero-iitokodori.png を更新しました')
}

main().catch(err => { console.error(err); process.exit(1) })
