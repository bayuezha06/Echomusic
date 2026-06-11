<template>
  <div class="app-container">
    <div class="main-layout">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <AppSidebar />
      </aside>

      <!-- 主内容 -->
      <main class="content-area">
        <div class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <!-- 底部播放器 -->
    <PlayerBar />

    <!-- 歌词面板 -->
    <LyricsPanel v-if="playerStore.showLyrics" />

    <!-- 播放列表抽屉 -->
    <PlaylistDrawer v-if="playerStore.showPlaylist" />
  </div>
</template>

<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
import LyricsPanel from '@/components/player/LyricsPanel.vue'
import PlayerBar from '@/components/player/PlayerBar.vue'
import PlaylistDrawer from '@/components/player/PlaylistDrawer.vue'
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()
</script>
