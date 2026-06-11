<template>
  <div class="app-container">
    <!-- 移动端顶栏 -->
    <header class="mobile-header">
      <button class="menu-btn" @click="sidebarOpen = true">
        <el-icon><Fold /></el-icon>
      </button>
      <div class="mobile-logo">♪ EchoMusic</div>
      <router-link to="/favorites" class="menu-btn">
        <el-icon><Star /></el-icon>
      </router-link>
    </header>

    <div class="main-layout">
      <!-- 侧边栏：桌面端固定，移动端抽屉 -->
      <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <AppSidebar @close="sidebarOpen = false" />
      </aside>

      <!-- 移动端遮罩 -->
      <div v-if="sidebarOpen" class="sidebar-mask" @click="sidebarOpen = false" />

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

    <!-- 移动端底部导航 -->
    <BottomNav />

    <!-- 歌词面板 -->
    <LyricsPanel v-if="playerStore.showLyrics" />

    <!-- 播放列表抽屉 -->
    <PlaylistDrawer v-if="playerStore.showPlaylist" />
  </div>
</template>

<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import LyricsPanel from '@/components/player/LyricsPanel.vue'
import PlayerBar from '@/components/player/PlayerBar.vue'
import PlaylistDrawer from '@/components/player/PlaylistDrawer.vue'
import { usePlayerStore } from '@/stores/player'
import { ref } from 'vue'

const playerStore = usePlayerStore()
const sidebarOpen = ref(false)
</script>

<style scoped>
/* 移动端顶栏 */
.mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  height: var(--mobile-header-height);
  padding: 0 12px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  z-index: 90;
}

.mobile-logo {
  font-size: 17px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-light), #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.menu-btn {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
  text-decoration: none;
}
.menu-btn:hover { color: var(--text-primary); background: var(--bg-hover); }

/* 移动端遮罩 */
.sidebar-mask {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 95;
}

@media (max-width: 768px) {
  .mobile-header { display: flex; }
  .sidebar-mask { display: block; }

  .sidebar {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    height: 100% !important;
    z-index: 96 !important;
    transform: translateX(-100%);
    transition: transform 0.28s ease;
    box-shadow: 4px 0 24px rgba(0,0,0,0.5);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }
}
</style>
