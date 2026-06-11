<template>
  <div class="player-bar">
    <!-- 左：歌曲信息 -->
    <div class="song-info" @click="playerStore.currentSong && (playerStore.showLyrics = !playerStore.showLyrics)">
      <div class="cover-box" :class="{ playing: playerStore.isPlaying }">
        <img
          v-if="playerStore.currentSong"
          :src="playerStore.currentSong.cover"
          :alt="playerStore.currentSong.title"
          class="cover-img"
          :class="{ spinning: playerStore.isPlaying }"
        />
        <div v-else class="cover-placeholder">
          <el-icon><Headset /></el-icon>
        </div>
      </div>

      <div class="meta" v-if="playerStore.currentSong">
        <div class="song-title">{{ playerStore.currentSong.title }}</div>
        <div class="song-artist">{{ playerStore.currentSong.artist }}</div>
      </div>
      <div class="meta" v-else>
        <div class="song-title muted">暂无播放</div>
        <div class="song-artist">点击歌曲开始播放</div>
      </div>

      <!-- 收藏按钮 -->
      <button
        v-if="playerStore.currentSong"
        class="icon-btn fav-btn"
        :class="{ active: favStore.isFavorited(playerStore.currentSong?.id) }"
        @click.stop="toggleFav"
        title="收藏"
      >
        <el-icon>
          <StarFilled v-if="favStore.isFavorited(playerStore.currentSong?.id)" />
          <Star v-else />
        </el-icon>
      </button>
    </div>

    <!-- 中：控制区 + 进度条 -->
    <div class="controls-center">
      <div class="playback-btns">
        <!-- 播放模式 -->
        <button class="icon-btn mode-btn" :title="playerStore.modeLabel" @click="playerStore.cyclePlayMode()">
          <el-icon>
            <Refresh v-if="playerStore.playMode === 'loop'" />
            <Sort v-else-if="playerStore.playMode === 'sequence'" />
            <Aim v-else />
          </el-icon>
        </button>

        <!-- 上一首 -->
        <button class="icon-btn skip-btn" title="上一首" @click="playerStore.playPrev()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
          </svg>
        </button>

        <!-- 播放/暂停 -->
        <button class="play-pause-btn" @click="playerStore.togglePlay()">
          <el-icon v-if="playerStore.isLoading"><Loading /></el-icon>
          <el-icon v-else-if="playerStore.isPlaying"><VideoPause /></el-icon>
          <el-icon v-else><VideoPlay /></el-icon>
        </button>

        <!-- 下一首 -->
        <button class="icon-btn skip-btn" title="下一首" @click="playerStore.playNext()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>

        <!-- 播放列表 -->
        <button
          class="icon-btn"
          :class="{ active: playerStore.showPlaylist }"
          title="播放列表"
          @click="playerStore.showPlaylist = !playerStore.showPlaylist"
        >
          <el-icon><List /></el-icon>
        </button>
      </div>

      <!-- 进度条 -->
      <div class="progress-row">
        <span class="time-label">{{ playerStore.formattedCurrentTime }}</span>
        <el-slider
          class="progress-slider"
          :model-value="playerStore.currentTime"
          :max="playerStore.duration || 100"
          :step="0.5"
          :show-tooltip="false"
          :disabled="!playerStore.currentSong"
          @change="playerStore.seek($event)"
        />
        <span class="time-label">{{ playerStore.formattedDuration }}</span>
      </div>
    </div>

    <!-- 右：音量 + 歌词 -->
    <div class="controls-right">
      <!-- 歌词 -->
      <button
        class="icon-btn"
        :class="{ active: playerStore.showLyrics }"
        title="歌词"
        @click="playerStore.showLyrics = !playerStore.showLyrics"
      >
        <el-icon><ChatLineSquare /></el-icon>
      </button>

      <!-- 音量 -->
      <div class="volume-wrap">
        <button class="icon-btn" @click="playerStore.toggleMute()" title="静音">
          <el-icon>
            <Mute v-if="playerStore.isMuted || playerStore.volume === 0" />
            <Bell v-else-if="playerStore.volume > 0.5" />
            <Microphone v-else />
          </el-icon>
        </button>
        <el-slider
          class="volume-slider"
          :model-value="playerStore.isMuted ? 0 : Math.round(playerStore.volume * 100)"
          :max="100"
          :show-tooltip="false"
          @change="playerStore.setVolume($event / 100)"
        />
      </div>
    </div>

    <!-- 频谱可视化 -->
    <canvas ref="vizCanvas" class="visualizer" width="120" height="40" />
  </div>
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favorites'
import { usePlayerStore } from '@/stores/player'
import { audioEngine } from '@/utils/audioEngine'
import { onMounted, onUnmounted, ref } from 'vue'

const playerStore = usePlayerStore()
const favStore = useFavoritesStore()

const vizCanvas = ref(null)
let rafId = null

function toggleFav() {
  if (!playerStore.currentSong) return
  favStore.toggleFavorite(playerStore.currentSong.id)
}

// 频谱可视化
function drawVisualizer() {
  const canvas = vizCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height

  ctx.clearRect(0, 0, W, H)

  if (!playerStore.isPlaying) {
    rafId = requestAnimationFrame(drawVisualizer)
    return
  }

  const data = audioEngine.getFrequencyData()
  const bars = 24
  const barW = Math.floor(W / bars) - 1
  const step = Math.floor(data.length / bars)

  for (let i = 0; i < bars; i++) {
    const value = data[i * step] / 255
    const barH = Math.max(2, value * H)
    const x = i * (barW + 1)
    const y = H - barH
    const alpha = 0.5 + value * 0.5
    ctx.fillStyle = `rgba(159,103,255,${alpha})`
    ctx.beginPath()
    ctx.roundRect(x, y, barW, barH, 2)
    ctx.fill()
  }

  rafId = requestAnimationFrame(drawVisualizer)
}

onMounted(() => {
  rafId = requestAnimationFrame(drawVisualizer)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.player-bar {
  height: var(--player-height);
  background: rgba(18, 18, 37, 0.92);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;
  flex-shrink: 0;
  position: relative;
  z-index: 100;
}

/* 歌曲信息 */
.song-info {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 260px;
  flex-shrink: 0;
  cursor: pointer;
  min-width: 0;
}

.cover-box {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.4);
  position: relative;
}
.cover-box.playing {
  box-shadow: 0 0 16px var(--primary-glow);
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 22px;
}

.meta {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.song-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.song-title.muted { color: var(--text-muted); font-weight: 400; }
.song-artist {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fav-btn { margin-left: 4px; }
.fav-btn.active { color: #F59E0B !important; }

/* 控制区 */
.controls-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.playback-btns {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: var(--transition);
}
.icon-btn:hover { color: var(--text-primary); background: var(--bg-hover); }
.icon-btn.active { color: var(--primary-light); }

.mode-btn { color: var(--text-muted); font-size: 15px; }

.skip-btn { font-size: 18px; }
.skip-btn:hover { color: var(--primary-light); }

.play-pause-btn {
  width: 44px;
  height: 44px;
  background: var(--primary);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: var(--transition);
  box-shadow: 0 0 16px var(--primary-glow);
}
.play-pause-btn:hover { background: var(--primary-light); transform: scale(1.05); }
.play-pause-btn:active { transform: scale(0.97); }

/* 进度条 */
.progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 500px;
}

.time-label {
  font-size: 11px;
  color: var(--text-muted);
  width: 34px;
  text-align: center;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.progress-slider {
  flex: 1;
}
:deep(.progress-slider .el-slider__runway) { height: 4px !important; cursor: pointer; }
:deep(.progress-slider .el-slider__bar) { height: 4px !important; }
:deep(.progress-slider .el-slider__button-wrapper) { top: -14px !important; }
:deep(.progress-slider .el-slider__button) {
  width: 12px !important;
  height: 12px !important;
  opacity: 0;
  transition: opacity 0.15s ease !important;
}
:deep(.progress-slider:hover .el-slider__button) { opacity: 1 !important; }

/* 右侧控制 */
.controls-right {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 220px;
  justify-content: flex-end;
  flex-shrink: 0;
}

.volume-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.volume-slider {
  width: 90px;
}
:deep(.volume-slider .el-slider__runway) { height: 3px !important; }
:deep(.volume-slider .el-slider__bar) { height: 3px !important; }
:deep(.volume-slider .el-slider__button-wrapper) { top: -15px !important; }
:deep(.volume-slider .el-slider__button) {
  width: 10px !important;
  height: 10px !important;
}

/* 频谱 */
.visualizer {
  flex-shrink: 0;
  opacity: 0.8;
  border-radius: 4px;
}

@media (max-width: 900px) {
  .visualizer { display: none; }
  .controls-right { width: auto; }
  .song-info { width: 200px; }
}
@media (max-width: 680px) {
  .mode-btn, .skip-btn, .volume-wrap { display: none; }
  .song-info { width: 140px; }
}
</style>
