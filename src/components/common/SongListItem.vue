<template>
  <div
    class="song-list-item"
    :class="{ active: isCurrentSong }"
    @click="handlePlay"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- 序号/播放状态 -->
    <div class="sli-index">
      <span v-if="!hovered && !isCurrentSong" class="num">{{ index + 1 }}</span>
      <span v-else-if="isCurrentSong && playerStore.isPlaying" class="bars">
        <span /><span /><span />
      </span>
      <el-icon v-else class="play-hover"><VideoPlay /></el-icon>
    </div>

    <!-- 封面 -->
    <img :src="song.cover" class="sli-cover" :alt="song.title" loading="lazy" />

    <!-- 信息 -->
    <div class="sli-info">
      <div class="sli-title" :class="{ 'active-text': isCurrentSong }">{{ song.title }}</div>
      <div class="sli-artist">{{ song.artist }}</div>
    </div>

    <!-- 专辑 -->
    <div class="sli-album">{{ song.album }}</div>

    <!-- 操作按钮组 -->
    <div class="sli-actions" @click.stop>
      <button
        class="action-btn"
        :class="{ active: favStore.isFavorited(song.id) }"
        @click="favStore.toggleFavorite(song.id)"
        title="收藏"
      >
        <el-icon>
          <StarFilled v-if="favStore.isFavorited(song.id)" />
          <Star v-else />
        </el-icon>
      </button>
      <button class="action-btn" @click="handleAddToQueue" title="添加到播放队列">
        <el-icon><Plus /></el-icon>
      </button>
    </div>

    <!-- 时长 -->
    <div class="sli-duration">{{ formatTime(song.duration) }}</div>
  </div>
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favorites'
import { usePlayerStore } from '@/stores/player'
import { formatTime } from '@/utils/lyricsParser'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'

const props = defineProps({
  song: { type: Object, required: true },
  index: { type: Number, default: 0 },
  queue: { type: Array, default: null }
})

const playerStore = usePlayerStore()
const favStore = useFavoritesStore()
const hovered = ref(false)

const isCurrentSong = computed(() => playerStore.currentSong?.id === props.song.id)

function handlePlay() {
  if (isCurrentSong.value) {
    playerStore.togglePlay()
  } else {
    favStore.addToHistory(props.song.id)
    playerStore.playSong(props.song, props.queue)
  }
}

function handleAddToQueue() {
  playerStore.addToQueue(props.song)
  ElMessage({ message: `已添加「${props.song.title}」到播放队列`, type: 'success', duration: 1500 })
}
</script>

<style scoped>
.song-list-item {
  display: grid;
  grid-template-columns: 36px 44px 1fr 1fr auto 64px;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  min-width: 0;
}
.song-list-item:hover { background: var(--bg-hover); }
.song-list-item.active { background: rgba(124,58,237,0.1); }
.song-list-item:hover .sli-actions { opacity: 1; }

.sli-index {
  text-align: center;
  width: 36px;
  flex-shrink: 0;
}
.num { font-size: 13px; color: var(--text-muted); }
.bars {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
}
.bars span {
  display: block;
  width: 3px;
  background: var(--primary-light);
  border-radius: 2px;
  animation: bounce 0.7s ease infinite alternate;
}
.bars span:nth-child(1) { height: 6px; animation-delay: 0s; }
.bars span:nth-child(2) { height: 12px; animation-delay: 0.18s; }
.bars span:nth-child(3) { height: 8px; animation-delay: 0.35s; }
@keyframes bounce { from { height: 3px; } to { height: 14px; } }

.play-hover { color: var(--text-primary); font-size: 15px; }

.sli-cover {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.sli-info {
  min-width: 0;
  overflow: hidden;
}
.sli-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sli-title.active-text { color: var(--primary-light); font-weight: 600; }

.sli-artist {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sli-album {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sli-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.action-btn {
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: var(--transition);
}
.action-btn:hover { color: var(--text-primary); background: var(--bg-active); }
.action-btn.active { color: #F59E0B; }

.sli-duration {
  font-size: 13px;
  color: var(--text-muted);
  text-align: right;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .sli-album { display: none; }
  .song-list-item {
    grid-template-columns: 36px 44px 1fr auto 64px;
  }
}
@media (max-width: 480px) {
  .song-list-item {
    grid-template-columns: 28px 38px 1fr auto;
    gap: 8px;
    padding: 7px 10px;
  }
  .sli-duration { display: none; }
  .sli-cover { width: 38px; height: 38px; }
  .sli-index { width: 28px; }
  .sli-title { font-size: 13px; }
  .sli-artist { font-size: 11px; }
  /* 操作按钮在小屏始终显示 */
  .sli-actions { opacity: 1; }
}
</style>
