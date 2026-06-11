<template>
  <nav class="bottom-nav">
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
      <span>排行</span>
    </router-link>
    <router-link to="/favorites" class="nav-item" :class="{ active: $route.path === '/favorites' }">
      <el-icon><StarFilled /></el-icon>
      <span>收藏</span>
    </router-link>
    <router-link to="/profile" class="nav-item" :class="{ active: $route.path === '/profile' }">
      <el-icon><User /></el-icon>
      <span>我的</span>
    </router-link>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav-height);
  background: rgba(18, 18, 37, 0.97);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-light);
  z-index: 110;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 0 4px;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex: 1;
  min-height: 50px;
  color: var(--text-muted);
  text-decoration: none;
  transition: var(--transition);
  border-radius: var(--radius-sm);
  padding: 6px 4px;
}
.nav-item .el-icon { font-size: 20px; }
.nav-item span { font-size: 10px; font-weight: 500; }
.nav-item:hover { color: var(--text-secondary); }
.nav-item.active { color: var(--primary-light); }

@media (max-width: 768px) {
  .bottom-nav { display: flex; }
}
</style>
