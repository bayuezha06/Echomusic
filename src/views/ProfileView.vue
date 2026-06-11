<template>
  <div class="profile-view">
    <!-- 用户信息 -->
    <div class="profile-hero">
      <div class="avatar-wrap">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=echo" class="avatar" alt="avatar" />
        <div class="online-dot" />
      </div>
      <div class="user-info">
        <h1 class="user-name">音乐爱好者</h1>
        <p class="user-bio">热爱音乐，享受每一个音符带来的感动 🎵</p>
        <div class="user-stats">
          <div class="stat-item">
            <div class="stat-num">{{ favStore.favoriteSongs.length }}</div>
            <div class="stat-label">收藏</div>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <div class="stat-num">{{ playlistStore.userPlaylists.length }}</div>
            <div class="stat-label">歌单</div>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <div class="stat-num">{{ listenDays }}</div>
            <div class="stat-label">听歌天数</div>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <div class="stat-num">{{ totalSongs }}</div>
            <div class="stat-label">播放歌曲</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区 -->
    <div class="charts-grid">
      <!-- 月度听歌时长 -->
      <div class="chart-card">
        <div class="chart-title">月度听歌时长（小时）</div>
        <div ref="barRef" class="chart-box" />
      </div>

      <!-- 品味雷达 -->
      <div class="chart-card">
        <div class="chart-title">音乐品味分析</div>
        <div ref="radarRef" class="chart-box" />
      </div>
    </div>

    <!-- 最近收藏 -->
    <section v-if="favStore.favoriteSongs.length" style="margin-top:32px">
      <div class="section-header">
        <h2 class="section-title">我的收藏</h2>
        <router-link to="/favorites" class="section-more">查看全部 →</router-link>
      </div>
      <div class="recent-grid">
        <SongCard
          v-for="song in favStore.favoriteSongs.slice(0, 6)"
          :key="song.id"
          :song="song"
          :queue="favStore.favoriteSongs"
        />
      </div>
    </section>

    <!-- 播放历史 -->
    <section v-if="favStore.recentHistory.length" style="margin-top:32px">
      <div class="section-header">
        <h2 class="section-title">播放历史</h2>
      </div>
      <div class="history-list">
        <SongListItem
          v-for="(song, i) in favStore.recentHistory.slice(0, 8)"
          :key="song.id"
          :song="song"
          :index="i"
          :queue="favStore.recentHistory"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import SongCard from '@/components/common/SongCard.vue'
import SongListItem from '@/components/common/SongListItem.vue'
import { userListeningHours, userTasteRadar } from '@/mock/stats'
import { useFavoritesStore } from '@/stores/favorites'
import { usePlaylistStore } from '@/stores/playlist'
import * as echarts from 'echarts'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const favStore = useFavoritesStore()
const playlistStore = usePlaylistStore()

const barRef = ref(null)
const radarRef = ref(null)
let barChart = null
let radarChart = null

const listenDays = computed(() => {
  const start = new Date('2024-01-01')
  return Math.floor((Date.now() - start) / 86400000)
})

const totalSongs = computed(() => favStore.recentHistory.length + 35)

const THEME = {
  text: '#94A3B8',
  grid: 'rgba(255,255,255,0.05)',
  primary: '#7C3AED',
  primaryLight: '#9F67FF',
  tooltip: {
    backgroundColor: '#1E1E3A',
    borderColor: 'rgba(255,255,255,0.12)',
    textStyle: { color: '#F1F5F9' }
  }
}

function buildBarOption() {
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', ...THEME.tooltip },
    grid: { top: 16, right: 16, bottom: 28, left: 36 },
    xAxis: {
      type: 'category',
      data: userListeningHours.labels,
      axisLabel: { color: THEME.text, fontSize: 11 },
      axisLine: { lineStyle: { color: THEME.grid } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: THEME.text, fontSize: 11 },
      splitLine: { lineStyle: { color: THEME.grid } },
      axisLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: userListeningHours.data,
      barMaxWidth: 36,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: THEME.primaryLight },
          { offset: 1, color: THEME.primary }
        ]),
        borderRadius: [6, 6, 0, 0]
      }
    }]
  }
}

function buildRadarOption() {
  return {
    backgroundColor: 'transparent',
    tooltip: { ...THEME.tooltip },
    radar: {
      indicator: userTasteRadar.indicators,
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: THEME.text, fontSize: 12 },
      splitLine: { lineStyle: { color: THEME.grid } },
      splitArea: { show: false },
      axisLine: { lineStyle: { color: THEME.grid } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: userTasteRadar.data,
        name: '音乐品味',
        areaStyle: { color: 'rgba(124,58,237,0.2)' },
        lineStyle: { color: THEME.primaryLight, width: 2 },
        itemStyle: { color: THEME.primaryLight }
      }]
    }]
  }
}

onMounted(() => {
  barChart = echarts.init(barRef.value)
  radarChart = echarts.init(radarRef.value)
  barChart.setOption(buildBarOption())
  radarChart.setOption(buildRadarOption())

  const resize = () => { barChart?.resize(); radarChart?.resize() }
  window.addEventListener('resize', resize)
  onUnmounted(() => {
    window.removeEventListener('resize', resize)
    barChart?.dispose()
    radarChart?.dispose()
  })
})
</script>

<style scoped>
/* 用户信息 */
.profile-hero {
  display: flex;
  align-items: center;
  gap: 32px;
  background: linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.05) 100%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: 36px 40px;
  margin-bottom: 32px;
}

.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 3px solid rgba(124,58,237,0.5);
  background: var(--bg-card);
  object-fit: cover;
}

.online-dot {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  background: #10B981;
  border-radius: 50%;
  border: 3px solid var(--bg-base);
}

.user-name {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}

.user-bio {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.user-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.stat-item { text-align: center; }
.stat-num { font-size: 22px; font-weight: 700; color: var(--text-primary); }
.stat-label { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border-light);
}

/* 图表网格 */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.chart-box {
  width: 100%;
  height: 220px;
}

/* 收藏网格 */
.recent-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

/* 历史列表 */
.history-list {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

@media (max-width: 900px) {
  .charts-grid { grid-template-columns: 1fr; }
  .recent-grid { grid-template-columns: repeat(3, 1fr); }
  .profile-hero { flex-direction: column; text-align: center; }
  .user-stats { justify-content: center; }
}
@media (max-width: 480px) {
  .profile-hero { padding: 20px 16px; gap: 16px; }
  .avatar { width: 72px; height: 72px; }
  .user-name { font-size: 20px; }
  .stat-num { font-size: 18px; }
  .user-stats { gap: 14px; }
  .recent-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .chart-box { height: 170px; }
}
</style>
