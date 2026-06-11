<template>
  <div class="lyrics-overlay" @click.self="playerStore.showLyrics = false">
    <div class="lyrics-panel">
      <!-- 头部 -->
      <div class="lp-header">
        <div class="lp-song-info" v-if="playerStore.currentSong">
          <img :src="playerStore.currentSong.cover" class="lp-cover" :class="{ spinning: playerStore.isPlaying }" />
          <div>
            <div class="lp-title">{{ playerStore.currentSong.title }}</div>
            <div class="lp-artist">{{ playerStore.currentSong.artist }}</div>
          </div>
        </div>
        <button class="close-btn" @click="playerStore.showLyrics = false">
          <el-icon><Close /></el-icon>
        </button>
      </div>

      <!-- 歌词容器 -->
      <div class="lyrics-scroll" ref="scrollRef">
        <div class="lyrics-inner">
          <div v-if="!parsedLyrics.length" class="no-lyrics">
            <el-icon><Headset /></el-icon>
            <p>暂无歌词</p>
          </div>
          <div
            v-for="(line, idx) in parsedLyrics"
            :key="idx"
            class="lyric-line"
            :class="{ active: idx === currentIdx, past: idx < currentIdx }"
            :ref="el => { if (idx === currentIdx) activeLine = el }"
            @click="playerStore.seek(line.time)"
          >
            {{ line.text }}
          </div>
        </div>
      </div>

      <!-- 底部控制 -->
      <div class="lp-controls">
        <button class="icon-btn" @click="playerStore.playPrev()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
          </svg>
        </button>
        <button class="play-btn" @click="playerStore.togglePlay()">
          <el-icon><VideoPause v-if="playerStore.isPlaying" /><VideoPlay v-else /></el-icon>
        </button>
        <button class="icon-btn" @click="playerStore.playNext()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '@/stores/player'
import { getCurrentLyricIndex, parseLRC } from '@/utils/lyricsParser'
import { computed, nextTick, ref, watch } from 'vue'

const playerStore = usePlayerStore()
const scrollRef = ref(null)
const activeLine = ref(null)

const parsedLyrics = computed(() => {
  if (!playerStore.currentSong?.lyrics) return []
  return parseLRC(playerStore.currentSong.lyrics)
})

const currentIdx = computed(() =>
  getCurrentLyricIndex(parsedLyrics.value, playerStore.currentTime)
)

// 自动滚动到当前歌词
watch(currentIdx, async () => {
  await nextTick()
  if (activeLine.value && scrollRef.value) {
    const container = scrollRef.value
    const el = activeLine.value
    const containerMid = container.clientHeight / 2
    const elTop = el.offsetTop - container.offsetTop
    container.scrollTo({
      top: elTop - containerMid + el.clientHeight / 2,
      behavior: 'smooth'
    })
  }
})
</script>

<style scoped>
.lyrics-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 18, 0.85);
  backdrop-filter: blur(12px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lyrics-panel {
  width: 480px;
  max-width: 95vw;
  height: 70vh;
  max-height: 600px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-lg), 0 0 60px var(--primary-glow);
}

/* 头部 */
.lp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.lp-song-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lp-cover {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(0,0,0,0.4);
}

.lp-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}
.lp-artist {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.close-btn {
  width: 32px;
  height: 32px;
  background: var(--bg-hover);
  border: none;
  border-radius: 50%;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: var(--transition);
}
.close-btn:hover { color: var(--text-primary); background: var(--bg-active); }

/* 歌词滚动区 */
.lyrics-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
}

.lyrics-inner {
  padding: 0 24px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.no-lyrics {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-muted);
  height: 100%;
  padding: 60px 0;
  font-size: 14px;
}
.no-lyrics .el-icon { font-size: 40px; }

.lyric-line {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-muted);
  text-align: center;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.lyric-line:hover { color: var(--text-secondary); background: var(--bg-hover); }

.lyric-line.past { color: rgba(148,163,184,0.5); }

.lyric-line.active {
  font-size: 17px;
  font-weight: 600;
  color: var(--primary-light);
  text-shadow: 0 0 20px var(--primary-glow);
  transform: scale(1.02);
}

/* 底部控制 */
.lp-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 16px 24px 20px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.icon-btn {
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: var(--transition);
}
.icon-btn:hover { color: var(--text-primary); background: var(--bg-hover); }

.play-btn {
  width: 52px;
  height: 52px;
  background: var(--primary);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  transition: var(--transition);
  box-shadow: 0 0 20px var(--primary-glow);
}
.play-btn:hover { background: var(--primary-light); transform: scale(1.05); }
</style>
