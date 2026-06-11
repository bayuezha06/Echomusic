<template>
  <div class="playlist-detail" v-if="playlist">
    <!-- 顶部信息 -->
    <div class="pl-hero">
      <img :src="playlist.cover" class="pl-cover" :alt="playlist.name" />
      <div class="pl-meta">
        <p class="pl-type">歌单</p>
        <h1 class="pl-name">{{ playlist.name }}</h1>
        <p class="pl-desc">{{ playlist.description }}</p>
        <div class="pl-stats">
          <span>{{ playlist.creator }}</span>
          <span class="dot">·</span>
          <span>{{ playlistSongs.length }} 首歌曲</span>
          <span class="dot">·</span>
          <span>{{ formatPlayCount(playlist.playCount) }} 次播放</span>
        </div>
        <div class="pl-tags">
          <span v-for="tag in playlist.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="pl-actions">
          <button class="btn-primary" @click="playAll">
            <el-icon><VideoPlay /></el-icon>
            播放全部
          </button>
          <button class="btn-ghost" @click="shufflePlay">
            <el-icon><Aim /></el-icon>
            随机播放
          </button>
        </div>
      </div>
    </div>

    <!-- 歌曲列表 -->
    <div class="list-header">
      <span>#</span>
      <span></span>
      <span>歌曲</span>
      <span>专辑</span>
      <span></span>
      <span>时长</span>
    </div>

    <div class="song-list">
      <SongListItem
        v-for="(song, i) in playlistSongs"
        :key="song.id"
        :song="song"
        :index="i"
        :queue="playlistSongs"
      />
    </div>
  </div>

  <div v-else class="empty-state">
    <el-icon><Warning /></el-icon>
    <p>歌单不存在</p>
    <button class="btn-primary" @click="$router.push('/')">返回首页</button>
  </div>
</template>

<script setup>
import SongListItem from '@/components/common/SongListItem.vue'
import { usePlayerStore } from '@/stores/player'
import { usePlaylistStore } from '@/stores/playlist'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const playlistStore = usePlaylistStore()
const playerStore = usePlayerStore()

const playlist = computed(() => playlistStore.getPlaylistById(Number(route.params.id)))
const playlistSongs = computed(() => playlistStore.getPlaylistSongs(Number(route.params.id)))

function playAll() {
  const songs = playlistSongs.value
  if (songs.length) playerStore.playSong(songs[0], songs)
}

function shufflePlay() {
  const songs = [...playlistSongs.value]
  const idx = Math.floor(Math.random() * songs.length)
  playerStore.setPlayMode('random')
  playerStore.playSong(songs[idx], songs)
}

function formatPlayCount(n) {
  if (!n) return '0'
  if (n >= 1e8) return `${(n / 1e8).toFixed(1)}亿`
  if (n >= 1e4) return `${(n / 1e4).toFixed(0)}万`
  return n.toString()
}
</script>

<style scoped>
.pl-hero {
  display: flex;
  gap: 32px;
  margin-bottom: 36px;
  align-items: flex-start;
}

.pl-cover {
  width: 200px;
  height: 200px;
  border-radius: var(--radius-lg);
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: var(--shadow-lg);
}

.pl-type {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-light);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.pl-name {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  line-height: 1.2;
  margin-bottom: 12px;
}

.pl-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
}

.pl-stats {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 12px;
}
.dot { color: var(--text-muted); }

.pl-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.pl-actions { display: flex; gap: 12px; }

.list-header {
  display: grid;
  grid-template-columns: 36px 44px 1fr 1fr auto 64px;
  gap: 12px;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}

.song-list {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 0;
  color: var(--text-muted);
}
.empty-state .el-icon { font-size: 48px; }

@media (max-width: 700px) {
  .pl-hero { flex-direction: column; }
  .pl-cover { width: 140px; height: 140px; }
  .pl-name { font-size: 22px; }
  .list-header { display: none; }
}
</style>
