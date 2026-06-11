<template>
  <div
    class="song-card"
    @click="handlePlay"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- 封面 -->
    <div class="card-cover">
      <img :src="song.cover" :alt="song.title" class="cover-img" loading="lazy" />
      <div class="cover-overlay" :class="{ visible: hovered || isCurrentSong }">
        <button class="play-icon-btn" @click.stop="handlePlay">
          <el-icon v-if="isCurrentSong && playerStore.isPlaying"><VideoPause /></el-icon>
          <el-icon v-else><VideoPlay /></el-icon>
        </button>
      </div>
      <div v-if="isCurrentSong && playerStore.isPlaying" class="playing-badge">
        <span class="bar" /><span class="bar" /><span class="bar" />
      </div>
    </div>

    <!-- 信息 -->
    <div class="card-info">
      <div class="card-title" :class="{ 'active-title': isCurrentSong }">
        {{ song.title }}
      </div>
      <div class="card-artist">{{ song.artist }}</div>
    </div>
  </div>
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favorites'
import { usePlayerStore } from '@/stores/player'
import { computed, ref } from 'vue'

const props = defineProps({
  song: { type: Object, required: true },
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
</script>

<style scoped>
.song-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
  cursor: pointer;
  transition: var(--transition);
  user-select: none;
}
.song-card:hover {
  background: var(--bg-hover);
  border-color: var(--border-light);
  transform: translateY(-3px);
  box-shadow: var(--shadow);
}

.card-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: 10px;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.song-card:hover .cover-img { transform: scale(1.04); }

.cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: var(--radius-sm);
}
.cover-overlay.visible { opacity: 1; }

.play-icon-btn {
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
  box-shadow: 0 0 20px var(--primary-glow);
}
.play-icon-btn:hover { background: var(--primary-light); transform: scale(1.08); }

/* 正在播放指示 */
.playing-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;
}
.bar {
  display: block;
  width: 3px;
  background: var(--primary-light);
  border-radius: 2px;
  animation: bounce 0.8s ease infinite alternate;
}
.bar:nth-child(1) { height: 8px; animation-delay: 0s; }
.bar:nth-child(2) { height: 14px; animation-delay: 0.2s; }
.bar:nth-child(3) { height: 10px; animation-delay: 0.4s; }

@keyframes bounce {
  from { height: 4px; }
  to   { height: 16px; }
}

.card-info { padding: 0 2px; }

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}
.card-title.active-title { color: var(--primary-light); }

.card-artist {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
