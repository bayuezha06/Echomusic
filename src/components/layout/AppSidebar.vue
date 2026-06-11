<template>
  <div class="sidebar-inner">
    <!-- Logo -->
    <div class="logo" @click="$router.push('/')">
      <div class="logo-icon">♪</div>
      <span class="logo-text">EchoMusic</span>
    </div>

    <!-- 主导航 -->
    <nav class="nav-section">
      <p class="nav-label">发现</p>
      <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </router-link>
      <router-link to="/discover" class="nav-item" :class="{ active: $route.path === '/discover' }">
        <el-icon><Compass /></el-icon>
        <span>音乐库</span>
      </router-link>
      <router-link to="/charts" class="nav-item" :class="{ active: $route.path === '/charts' }">
        <el-icon><TrendCharts /></el-icon>
        <span>热歌榜</span>
      </router-link>
    </nav>

    <!-- 我的 -->
    <nav class="nav-section">
      <p class="nav-label">我的</p>
      <router-link to="/favorites" class="nav-item" :class="{ active: $route.path === '/favorites' }">
        <el-icon><StarFilled /></el-icon>
        <span>我的收藏</span>
      </router-link>
      <router-link to="/profile" class="nav-item" :class="{ active: $route.path === '/profile' }">
        <el-icon><User /></el-icon>
        <span>个人中心</span>
      </router-link>
    </nav>

    <!-- 歌单 -->
    <nav class="nav-section playlists-section">
      <div class="nav-label-row">
        <p class="nav-label">歌单</p>
        <el-icon class="add-btn" @click="showCreate = true"><Plus /></el-icon>
      </div>

      <div class="playlist-list">
        <router-link
          v-for="pl in playlistStore.userPlaylists"
          :key="pl.id"
          :to="`/playlist/${pl.id}`"
          class="nav-item playlist-item"
          :class="{ active: $route.params.id == pl.id }"
        >
          <el-icon><Headset /></el-icon>
          <span class="text-ellipsis">{{ pl.name }}</span>
        </router-link>
      </div>
    </nav>

    <!-- 底部：用户 -->
    <div class="sidebar-footer">
      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=echo" class="avatar" alt="avatar" />
      <div class="user-info">
        <p class="user-name">音乐爱好者</p>
        <p class="user-sub">已听 {{ totalDays }} 天音乐</p>
      </div>
    </div>

    <!-- 创建歌单弹窗 -->
    <el-dialog v-model="showCreate" title="创建歌单" width="360px" class="dark-dialog">
      <el-input v-model="newName" placeholder="请输入歌单名称" maxlength="30" show-word-limit />
      <template #footer>
        <el-button @click="showCreate = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { usePlaylistStore } from '@/stores/playlist'
import { computed, ref } from 'vue'

const playlistStore = usePlaylistStore()
const showCreate = ref(false)
const newName = ref('')

const totalDays = computed(() => {
  const start = new Date('2024-01-01')
  return Math.floor((Date.now() - start) / 86400000)
})

function handleCreate() {
  const name = newName.value.trim()
  if (!name) return
  playlistStore.createPlaylist(name)
  newName.value = ''
  showCreate.value = false
}
</script>

<style scoped>
.sidebar-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  overflow-y: auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 24px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary), #06B6D4);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: var(--shadow-glow);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-light), #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-section {
  padding: 0 12px;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.nav-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0 8px;
  margin-bottom: 4px;
}

.nav-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 4px;
}

.add-btn {
  color: var(--text-muted);
  cursor: pointer;
  font-size: 14px;
  transition: var(--transition);
  padding: 2px;
}
.add-btn:hover { color: var(--primary-light); }

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
}
.nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
.nav-item.active { background: rgba(124,58,237,0.18); color: var(--primary-light); }
.nav-item .el-icon { font-size: 16px; flex-shrink: 0; }

.playlists-section { flex: 1; min-height: 0; }

.playlist-list {
  max-height: 180px;
  overflow-y: auto;
}

.playlist-item span.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
  margin-top: auto;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--border-light);
  background: var(--bg-card);
}

.user-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.user-sub { font-size: 11px; color: var(--text-muted); margin-top: 1px; }

/* 暗色弹窗 */
:deep(.dark-dialog .el-dialog) {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-light);
}
:deep(.dark-dialog .el-dialog__title) { color: var(--text-primary) !important; }
:deep(.dark-dialog .el-input__wrapper) {
  background: var(--bg-surface) !important;
  box-shadow: none !important;
  border: 1px solid var(--border-light) !important;
}
:deep(.dark-dialog .el-input__inner) { color: var(--text-primary) !important; }
</style>
