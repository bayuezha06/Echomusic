<template>
  <div class="drawer-overlay" @click.self="playerStore.showPlaylist = false">
    <div class="playlist-drawer">
      <!-- 头部 -->
      <div class="drawer-header">
        <h3 class="drawer-title">
          播放队列
          <span class="count">{{ playerStore.queue.length }} 首</span>
        </h3>
        <div class="header-actions">
          <button class="text-btn" @click="playerStore.clearQueue()" v-if="playerStore.queue.length">
            清空
          </button>
          <button class="close-btn" @click="playerStore.showPlaylist = false">
            <el-icon><Close /></el-icon>
          </button>
        </div>
      </div>

      <!-- 列表 -->
      <div class="queue-list" ref="listRef">
        <div v-if="!playerStore.queue.length" class="empty-state">
          <el-icon><Headset /></el-icon>
          <p>播放队列为空</p>
        </div>

        <div
          v-for="(song, idx) in playerStore.queue"
          :key="song.id"
          class="queue-item"
          :class="{ active: idx === playerStore.currentIndex }"
          @click="playerStore.playFromQueue(idx)"
        >
          <div class="qi-num">
            <span v-if="idx !== playerStore.currentIndex">{{ idx + 1 }}</span>
            <el-icon v-else class="playing-icon"><VideoPlay /></el-icon>
          </div>
          <img :src="song.cover" class="qi-cover" :alt="song.title" />
          <div class="qi-info">
            <div class="qi-title">{{ song.title }}</div>
            <div class="qi-artist">{{ song.artist }}</div>
          </div>
          <div class="qi-duration">{{ formatTime(song.duration) }}</div>
          <button
            class="qi-remove"
            @click.stop="playerStore.removeFromQueue(song.id)"
            title="从队列移除"
          >
            <el-icon><Close /></el-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '@/stores/player'
import { formatTime } from '@/utils/lyricsParser'
import { nextTick, ref, watch } from 'vue'

const playerStore = usePlayerStore()
const listRef = ref(null)

// 自动滚动到当前歌曲
watch(() => playerStore.currentIndex, async () => {
  await nextTick()
  if (!listRef.value) return
  const items = listRef.value.querySelectorAll('.queue-item')
  const active = items[playerStore.currentIndex]
  if (active) {
    active.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
})
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 18, 0.5);
  backdrop-filter: blur(6px);
  z-index: 150;
  display: flex;
  justify-content: flex-end;
}

.playlist-drawer {
  width: 360px;
  max-width: 100vw;
  height: 100%;
  background: var(--bg-surface);
  border-left: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 40px rgba(0,0,0,0.5);
  animation: slideIn 0.25s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

/* 头部 */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.drawer-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.count {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 400;
  background: var(--bg-card);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.text-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}
.text-btn:hover { color: #EF4444; background: rgba(239,68,68,0.1); }

.close-btn {
  width: 30px;
  height: 30px;
  background: var(--bg-hover);
  border: none;
  border-radius: 50%;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: var(--transition);
}
.close-btn:hover { color: var(--text-primary); }

/* 队列列表 */
.queue-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
  color: var(--text-muted);
  font-size: 14px;
}
.empty-state .el-icon { font-size: 40px; opacity: 0.4; }

.queue-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  cursor: pointer;
  transition: var(--transition);
  border-radius: 0;
}
.queue-item:hover { background: var(--bg-hover); }
.queue-item:hover .qi-remove { opacity: 1; }

.queue-item.active {
  background: rgba(124,58,237,0.12);
  border-left: 3px solid var(--primary);
}

.qi-num {
  width: 24px;
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.playing-icon { color: var(--primary-light); font-size: 14px; }

.qi-cover {
  width: 38px;
  height: 38px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.qi-info {
  flex: 1;
  min-width: 0;
}
.qi-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.queue-item.active .qi-title { color: var(--primary-light); }
.qi-artist {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.qi-duration {
  font-size: 12px;
  color: var(--text-muted);
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.qi-remove {
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  opacity: 0;
  transition: var(--transition);
  flex-shrink: 0;
}
.qi-remove:hover { color: #EF4444; background: rgba(239,68,68,0.1); }
</style>
