<template>
  <div class="discover-view">
    <div class="page-header">
      <h1 class="page-title">音乐库</h1>
      <p class="page-subtitle">共 {{ filteredSongs.length }} 首歌曲</p>
    </div>

    <!-- 搜索 + 筛选 -->
    <div class="toolbar">
      <el-input
        v-model="searchText"
        placeholder="搜索歌曲、歌手..."
        clearable
        class="search-input"
        :prefix-icon="Search"
      />
      <div class="filter-tabs">
        <button
          v-for="cat in categories"
          :key="cat"
          class="filter-tab"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- 全部播放 -->
    <div class="play-all-bar" v-if="filteredSongs.length">
      <button class="btn-primary" @click="playAll">
        <el-icon><VideoPlay /></el-icon>
        播放全部
      </button>
      <span class="song-count">{{ filteredSongs.length }} 首歌曲</span>
    </div>

    <!-- 列表头 -->
    <div class="list-header">
      <span class="lh-num">#</span>
      <span class="lh-cover"></span>
      <span class="lh-title">歌曲</span>
      <span class="lh-album">专辑</span>
      <span class="lh-actions"></span>
      <span class="lh-duration">时长</span>
    </div>

    <!-- 歌曲列表 -->
    <div class="song-list">
      <div v-if="!filteredSongs.length" class="empty-state">
        <el-icon><MusicNote /></el-icon>
        <p>没有找到匹配的歌曲</p>
      </div>

      <SongListItem
        v-for="(song, idx) in filteredSongs"
        :key="song.id"
        :song="song"
        :index="idx"
        :queue="filteredSongs"
      />
    </div>
  </div>
</template>

<script setup>
import SongListItem from '@/components/common/SongListItem.vue'
import { songs } from '@/mock/songs'
import { usePlayerStore } from '@/stores/player'
import { Search } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

const playerStore = usePlayerStore()

const searchText = ref('')
const activeCategory = ref('全部')

const categories = ['全部', '华语', '流行', '民谣', '经典']

// 为歌曲分配分类（简单 mock 逻辑）
const categoryMap = {
  '平凡之路': '民谣',
  '漠河舟': '民谣',
  '起风了': '民谣',
  '后来': '经典',
  '以父之名': '经典',
  '夜的第七章': '经典',
}

const filteredSongs = computed(() => {
  let list = songs
  if (searchText.value.trim()) {
    const q = searchText.value.trim().toLowerCase()
    list = list.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q)
    )
  }
  if (activeCategory.value !== '全部') {
    if (activeCategory.value === '华语' || activeCategory.value === '流行') {
      list = list.filter(s => !categoryMap[s.title])
    } else {
      list = list.filter(s => categoryMap[s.title] === activeCategory.value)
    }
  }
  return list
})

function playAll() {
  if (filteredSongs.value.length) {
    playerStore.playSong(filteredSongs.value[0], filteredSongs.value)
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input {
  width: 280px;
}
:deep(.search-input .el-input__wrapper) {
  background: var(--bg-card) !important;
  box-shadow: none !important;
  border: 1px solid var(--border-light) !important;
  border-radius: var(--radius-sm) !important;
}
:deep(.search-input .el-input__inner) { color: var(--text-primary) !important; }
:deep(.search-input .el-input__prefix) { color: var(--text-muted) !important; }

.filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; }

.filter-tab {
  padding: 6px 16px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: var(--transition);
}
.filter-tab:hover { color: var(--text-primary); border-color: var(--border-light); }
.filter-tab.active {
  background: rgba(124,58,237,0.2);
  border-color: var(--primary);
  color: var(--primary-light);
}

.play-all-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.song-count { font-size: 13px; color: var(--text-muted); }

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
  min-height: 100px;
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

@media (max-width: 768px) {
  .list-header { display: none; }
}
</style>
