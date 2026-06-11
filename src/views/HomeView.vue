<template>
  <div class="home-view">
    <!-- Hero Banner -->
    <div class="hero-banner">
      <div class="hero-content">
        <p class="hero-sub">今日推荐</p>
        <h1 class="hero-title">发现你的<span class="gradient-text"> 音乐世界</span></h1>
        <p class="hero-desc">{{ featuredSong.artist }} · {{ featuredSong.album }}</p>
        <div class="hero-actions">
          <button class="btn-primary" @click="playFeatured">
            <el-icon><VideoPlay /></el-icon>
            立即播放
          </button>
          <button class="btn-ghost" @click="$router.push('/discover')">
            <el-icon><Compass /></el-icon>
            探索更多
          </button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="vinyl" :class="{ spinning: playerStore.isPlaying && playerStore.currentSong?.id === featuredSong.id }">
          <img :src="featuredSong.cover" class="vinyl-img" />
          <div class="vinyl-center" />
        </div>
      </div>
    </div>

    <!-- 推荐歌单 -->
    <section class="content-section">
      <div class="section-header">
        <h2 class="section-title">精选歌单</h2>
        <router-link to="/discover" class="section-more">查看全部 →</router-link>
      </div>
      <div class="playlists-grid">
        <router-link
          v-for="pl in featuredPlaylists"
          :key="pl.id"
          :to="`/playlist/${pl.id}`"
          class="playlist-card"
        >
          <div class="pc-cover-wrap">
            <img :src="pl.cover" class="pc-cover" :alt="pl.name" loading="lazy" />
            <div class="pc-overlay">
              <el-icon class="pc-play"><VideoPlay /></el-icon>
            </div>
          </div>
          <div class="pc-name">{{ pl.name }}</div>
          <div class="pc-meta">{{ formatPlayCount(pl.playCount) }} 次播放</div>
        </router-link>
      </div>
    </section>

    <!-- 最新歌曲 -->
    <section class="content-section">
      <div class="section-header">
        <h2 class="section-title">热门歌曲</h2>
        <router-link to="/charts" class="section-more">查看排行 →</router-link>
      </div>
      <div class="songs-grid">
        <SongCard
          v-for="song in hotSongsList"
          :key="song.id"
          :song="song"
          :queue="hotSongsList"
        />
      </div>
    </section>

    <!-- 最近播放 -->
    <section class="content-section" v-if="recentSongs.length">
      <div class="section-header">
        <h2 class="section-title">最近播放</h2>
      </div>
      <div class="recent-list">
        <SongListItem
          v-for="(song, i) in recentSongs"
          :key="song.id"
          :song="song"
          :index="i"
          :queue="recentSongs"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import SongCard from '@/components/common/SongCard.vue'
import SongListItem from '@/components/common/SongListItem.vue'
import { songs } from '@/mock/songs'
import { useFavoritesStore } from '@/stores/favorites'
import { usePlayerStore } from '@/stores/player'
import { usePlaylistStore } from '@/stores/playlist'
import { computed } from 'vue'

const playerStore = usePlayerStore()
const favStore = useFavoritesStore()
const playlistStore = usePlaylistStore()

const featuredSong = songs[19] // 青花瓷

const featuredPlaylists = computed(() => playlistStore.playlists.slice(0, 5))

const hotSongsList = computed(() => songs.slice(0, 8))

const recentSongs = computed(() => favStore.recentHistory.slice(0, 6))

function playFeatured() {
  playerStore.playSong(featuredSong, songs)
}

function formatPlayCount(n) {
  if (n >= 1e8) return `${(n / 1e8).toFixed(1)}亿`
  if (n >= 1e4) return `${(n / 1e4).toFixed(0)}万`
  return n.toString()
}
</script>

<style scoped>
/* Hero */
.hero-banner {
  background: linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.08) 100%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: 40px 48px;
  margin-bottom: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  overflow: hidden;
  position: relative;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: -60px;
  right: 200px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%);
  pointer-events: none;
}

.hero-content { flex: 1; min-width: 0; }

.hero-sub {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--primary-light);
  text-transform: uppercase;
  margin-bottom: 12px;
}

.hero-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
  margin-bottom: 10px;
  letter-spacing: -1px;
}

.hero-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 28px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 黑胶唱片 */
.hero-visual { flex-shrink: 0; }

.vinyl {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 8px 40px rgba(0,0,0,0.6), 0 0 0 8px rgba(255,255,255,0.03);
}
.vinyl.spinning { animation: spin 6s linear infinite; }

.vinyl-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.vinyl-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-base);
  border: 4px solid rgba(255,255,255,0.15);
  box-shadow: 0 0 0 2px rgba(0,0,0,0.5) inset;
}

/* 歌单网格 */
.content-section { margin-bottom: 36px; }

.playlists-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.playlist-card {
  text-decoration: none;
  cursor: pointer;
  display: block;
  transition: var(--transition);
}
.playlist-card:hover { transform: translateY(-4px); }

.pc-cover-wrap {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  aspect-ratio: 1;
  margin-bottom: 10px;
}
.pc-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.playlist-card:hover .pc-cover { transform: scale(1.06); }

.pc-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.playlist-card:hover .pc-overlay { opacity: 1; }

.pc-play {
  width: 44px;
  height: 44px;
  background: var(--primary);
  border-radius: 50%;
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px var(--primary-glow);
}

.pc-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}
.pc-meta {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 3px;
}

/* 歌曲网格 */
.songs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* 最近播放 */
.recent-list {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

@media (max-width: 1100px) {
  .playlists-grid { grid-template-columns: repeat(4, 1fr); }
  .songs-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 800px) {
  .hero-banner { padding: 24px; }
  .hero-title { font-size: 26px; }
  .vinyl { width: 100px; height: 100px; }
  .playlists-grid { grid-template-columns: repeat(3, 1fr); }
  .songs-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .hero-banner {
    padding: 20px 16px;
    flex-direction: column;
    gap: 20px;
    text-align: center;
    align-items: center;
  }
  .hero-title { font-size: 22px; }
  .hero-desc { margin-bottom: 16px; }
  .hero-actions { justify-content: center; }
  .vinyl { width: 120px; height: 120px; }
  .playlists-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .songs-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .content-section { margin-bottom: 24px; }
}
</style>
