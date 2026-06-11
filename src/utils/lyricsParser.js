/**
 * LRC 歌词解析器
 * 支持标准 [mm:ss.xx] 格式，支持多时间标签
 */

/**
 * 解析 LRC 文本，返回 { time, text }[] 数组（按时间排序）
 */
export function parseLRC(lrcText) {
  if (!lrcText) return []

  const TIME_RE = /\[(\d{1,2}):(\d{2})\.(\d{2,3})\]/g
  const lines = lrcText.split('\n')
  const result = []

  for (const line of lines) {
    const times = []
    let match
    TIME_RE.lastIndex = 0
    while ((match = TIME_RE.exec(line)) !== null) {
      const mins = parseInt(match[1], 10)
      const secs = parseInt(match[2], 10)
      const ms = parseInt(match[3].padEnd(3, '0'), 10)
      times.push(mins * 60 + secs + ms / 1000)
    }
    const text = line.replace(/\[\d{1,2}:\d{2}\.\d{2,3}\]/g, '').trim()
    if (times.length > 0 && text) {
      for (const time of times) {
        result.push({ time, text })
      }
    }
  }

  return result.sort((a, b) => a.time - b.time)
}

/**
 * 根据当前播放时间找到应高亮的歌词行索引
 */
export function getCurrentLyricIndex(lyrics, currentTime) {
  if (!lyrics || lyrics.length === 0) return -1
  let idx = 0
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time <= currentTime) idx = i
    else break
  }
  return idx
}

/**
 * 格式化秒数为 mm:ss
 */
export function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
