<template>
  <div class="favorites-view">
    <div class="page-header">
      <h1 class="page-title">我的收藏</h1>
      <p class="page-subtitle">{{ favStore.favoriteSongs.length }} 首收藏歌曲</p>
    </div>

    <!-- 操作栏 -->
    <div class="fav-toolbar" v-if="favStore.favoriteSongs.length">
      <button class="btn-primary" @click="playAll">
        <el-icon><VideoPlay /></el-icon>
        播放全部
      </button>
      <button class="btn-ghost" @click="shufflePlay">
        <el-icon><Aim /></el-icon>
        随机播放
      </button>
    </div>

    <!-- 收藏列表 -->
    <div v-if="favStore.favoriteSongs.length" class="fav-list-wrap">
      <div class="list-header">
        <span>#</span>
        <span></span>
        <span>歌曲</span>
        <span>专辑</span>
        <span></span>
        <span>时长</span>
      </div>
      <div class="fav-list">
        <SongListItem
          v-for="(song, i) in favStore.favoriteSongs"
          :key="song.id"
          :song="song"
          :index="i"
          :queue="favStore.favoriteSongs"
        />
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <el-icon><Star /></el-icon>
      <p>还没有收藏任何歌曲</p>
      <p style="font-size:13px;color:var(--text-muted)">点击歌曲旁边的星形图标来收藏</p>
      <button class="btn-primary" @click="$router.push('/discover')" style="margin-top:8px">
        去发现音乐
      </button>
    </div>

    <!-- 最近播放记录 -->
    <section v-if="favStore.recentHistory.length" style="margin-top:36px">
      <div class="section-header">
        <h2 class="section-title">最近播放</h2>
      </div>
      <div class="recent-grid">
        <SongCard
          v-for="song in favStore.recentHistory.slice(0, 6)"
          :key="song.id"
          :song="song"
          :queue="favStore.recentHistory"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import SongCard from '@/components/common/SongCard.vue'
import SongListItem from '@/components/common/SongListItem.vue'
import { useFavoritesStore } from '@/stores/favorites'
import { usePlayerStore } from '@/stores/player'

const favStore = useFavoritesStore()
const playerStore = usePlayerStore()

function playAll() {
  const songs = favStore.favoriteSongs
  if (songs.length) playerStore.playSong(songs[0], songs)
}

function shufflePlay() {
  const songs = favStore.favoriteSongs
  if (!songs.length) return
  const idx = Math.floor(Math.random() * songs.length)
  playerStore.setPlayMode('random')
  playerStore.playSong(songs[idx], songs)
}
</script>

<style scoped>
.fav-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.fav-list-wrap { }

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

.fav-list {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 20px;
  color: var(--text-secondary);
  font-size: 15px;
}
.empty-state .el-icon { font-size: 56px; opacity: 0.3; }

.recent-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

@media (max-width: 1000px) {
  .recent-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 700px) {
  .recent-grid { grid-template-columns: repeat(3, 1fr); }
  .list-header { display: none; }
}
</style>
