<template>
  <div class="charts-view">
    <div class="page-header">
      <h1 class="page-title">热歌榜</h1>
      <p class="page-subtitle">实时追踪最受欢迎的音乐</p>
    </div>

    <div class="charts-layout">
      <!-- 左：热歌排行列表 -->
      <div class="hot-list-col">
        <div class="section-header" style="margin-bottom:16px">
          <h2 class="section-title">Top 15 热歌</h2>
          <button class="btn-primary" style="padding:7px 16px;font-size:13px" @click="playTop">
            <el-icon><VideoPlay /></el-icon> 播放全部
          </button>
        </div>

        <div class="hot-list">
          <div
            v-for="item in hotSongs"
            :key="item.id"
            class="hot-item"
            :class="{ active: playerStore.currentSong?.id === item.id }"
            @click="playSong(item)"
          >
            <!-- 排名 -->
            <div class="rank" :class="{ top3: item.rank <= 3 }">{{ item.rank }}</div>

            <!-- 封面 -->
            <img :src="getSong(item.id)?.cover" class="hi-cover" />

            <!-- 信息 -->
            <div class="hi-info">
              <div class="hi-title" :class="{ active: playerStore.currentSong?.id === item.id }">
                {{ item.title }}
              </div>
              <div class="hi-artist">{{ item.artist }}</div>
            </div>

            <!-- 播放量 -->
            <div class="hi-plays">{{ formatPlays(item.plays) }}</div>

            <!-- 趋势 -->
            <div class="hi-trend" :class="item.trend">
              <el-icon v-if="item.trend === 'up'"><TopRight /></el-icon>
              <el-icon v-else-if="item.trend === 'down'"><BottomRight /></el-icon>
              <span v-else class="dash">—</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右：图表 -->
      <div class="charts-col">
        <!-- 播放趋势图 -->
        <div class="chart-card">
          <div class="chart-title">
            近7天播放趋势
            <div class="period-tabs">
              <button
                v-for="p in ['7天', '30天']"
                :key="p"
                class="period-tab"
                :class="{ active: period === p }"
                @click="setPeriod(p)"
              >{{ p }}</button>
            </div>
          </div>
          <div ref="trendChartRef" class="chart-box" />
        </div>

        <!-- 曲风分布 -->
        <div class="chart-card">
          <div class="chart-title">曲风分布</div>
          <div ref="genreChartRef" class="chart-box chart-box-sm" />
        </div>
      </div>
    </div>

    <!-- 底部宽图：Top10 播放量柱状图 -->
    <div class="chart-card full-width-chart" style="margin-top:24px">
      <div class="chart-title">热歌播放量 Top 10</div>
      <div ref="barChartRef" class="chart-box chart-box-bar" />
    </div>
  </div>
</template>

<script setup>
import { songMap, songs } from '@/mock/songs'
import { genreDistribution, hotSongs, monthlyTrend, weeklyTrend } from '@/mock/stats'
import { usePlayerStore } from '@/stores/player'
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref } from 'vue'

const playerStore = usePlayerStore()

const trendChartRef = ref(null)
const genreChartRef = ref(null)
const barChartRef = ref(null)

let trendChart = null
let genreChart = null
let barChart = null

const period = ref('7天')

function getSong(id) { return songMap[id] }

function formatPlays(n) {
  if (n >= 1e8) return `${(n / 1e8).toFixed(1)}亿`
  if (n >= 1e4) return `${(n / 1e4).toFixed(0)}万`
  return n.toString()
}

function playSong(item) {
  const song = songMap[item.id]
  if (song) playerStore.playSong(song, songs)
}

function playTop() {
  const topSongs = hotSongs.slice(0, 15).map(h => songMap[h.id]).filter(Boolean)
  if (topSongs.length) playerStore.playSong(topSongs[0], topSongs)
}

const CHART_THEME = {
  bg: 'transparent',
  text: '#94A3B8',
  primary: '#7C3AED',
  primaryLight: '#9F67FF',
  cyan: '#06B6D4',
  grid: 'rgba(255,255,255,0.05)',
  tooltip: {
    backgroundColor: '#1E1E3A',
    borderColor: 'rgba(255,255,255,0.12)',
    textStyle: { color: '#F1F5F9' }
  }
}

function buildTrendOption(p) {
  const src = p === '7天' ? weeklyTrend : monthlyTrend
  return {
    backgroundColor: CHART_THEME.bg,
    tooltip: { trigger: 'axis', ...CHART_THEME.tooltip },
    grid: { top: 20, right: 20, bottom: 30, left: 48 },
    xAxis: {
      type: 'category',
      data: src.labels,
      axisLine: { lineStyle: { color: CHART_THEME.grid } },
      axisLabel: { color: CHART_THEME.text, fontSize: 11 },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: CHART_THEME.text, fontSize: 11 },
      splitLine: { lineStyle: { color: CHART_THEME.grid } },
      axisLine: { show: false }
    },
    series: [{
      type: 'line',
      data: src.data,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: CHART_THEME.primaryLight, width: 2.5 },
      itemStyle: { color: CHART_THEME.primaryLight },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(159,103,255,0.35)' },
          { offset: 1, color: 'rgba(159,103,255,0.02)' }
        ])
      }
    }]
  }
}

function buildGenreOption() {
  return {
    backgroundColor: CHART_THEME.bg,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {d}%',
      ...CHART_THEME.tooltip
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: CHART_THEME.text, fontSize: 12 },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['38%', '50%'],
      data: genreDistribution,
      itemStyle: { borderColor: '#12122580', borderWidth: 2 },
      label: { show: false },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' }
      }
    }],
    color: ['#7C3AED', '#9F67FF', '#06B6D4', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']
  }
}

function buildBarOption() {
  const top10 = hotSongs.slice(0, 10)
  return {
    backgroundColor: CHART_THEME.bg,
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const d = params[0]
        return `${d.name}<br/>播放量：${(d.value / 1e6).toFixed(2)}M`
      },
      ...CHART_THEME.tooltip
    },
    grid: { top: 20, right: 20, bottom: 60, left: 20, containLabel: true },
    xAxis: {
      type: 'category',
      data: top10.map(h => h.title),
      axisLabel: { color: CHART_THEME.text, fontSize: 11, interval: 0, rotate: 20 },
      axisLine: { lineStyle: { color: CHART_THEME.grid } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: CHART_THEME.text, fontSize: 11,
        formatter: v => `${(v / 1e6).toFixed(0)}M`
      },
      splitLine: { lineStyle: { color: CHART_THEME.grid } },
      axisLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: top10.map(h => h.plays),
      barMaxWidth: 40,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: CHART_THEME.primaryLight },
          { offset: 1, color: CHART_THEME.primary }
        ]),
        borderRadius: [6, 6, 0, 0]
      }
    }]
  }
}

function setPeriod(p) {
  period.value = p
  trendChart?.setOption(buildTrendOption(p))
}

onMounted(() => {
  trendChart = echarts.init(trendChartRef.value)
  genreChart = echarts.init(genreChartRef.value)
  barChart = echarts.init(barChartRef.value)

  trendChart.setOption(buildTrendOption('7天'))
  genreChart.setOption(buildGenreOption())
  barChart.setOption(buildBarOption())

  const resize = () => {
    trendChart?.resize()
    genreChart?.resize()
    barChart?.resize()
  }
  window.addEventListener('resize', resize)
  onUnmounted(() => {
    window.removeEventListener('resize', resize)
    trendChart?.dispose()
    genreChart?.dispose()
    barChart?.dispose()
  })
})
</script>

<style scoped>
.charts-layout {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 24px;
  margin-bottom: 0;
}

/* 热歌列表 */
.hot-list-col { min-width: 0; }

.hot-list {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.hot-item {
  display: grid;
  grid-template-columns: 32px 44px 1fr auto 28px;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  transition: var(--transition);
}
.hot-item:hover { background: var(--bg-hover); }
.hot-item.active { background: rgba(124,58,237,0.1); }

.rank {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-muted);
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.rank.top3 { color: var(--primary-light); }

.hi-cover {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  object-fit: cover;
}

.hi-info { min-width: 0; }
.hi-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hi-title.active { color: var(--primary-light); font-weight: 600; }
.hi-artist { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

.hi-plays {
  font-size: 12px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.hi-trend { font-size: 14px; text-align: center; }
.hi-trend.up { color: #10B981; }
.hi-trend.down { color: #EF4444; }
.hi-trend.same { color: var(--text-muted); }
.dash { font-size: 12px; }

/* 图表列 */
.charts-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.period-tabs {
  display: flex;
  gap: 6px;
}
.period-tab {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}
.period-tab.active {
  background: rgba(124,58,237,0.2);
  border-color: var(--primary);
  color: var(--primary-light);
}

.chart-box { width: 100%; height: 200px; }
.chart-box-sm { height: 180px; }
.chart-box-bar { height: 260px; }

@media (max-width: 1000px) {
  .charts-layout { grid-template-columns: 1fr; }
  .hot-list-col { max-height: 500px; overflow-y: auto; }
}
@media (max-width: 480px) {
  .hot-item {
    grid-template-columns: 28px 38px 1fr auto;
    gap: 8px;
    padding: 8px 12px;
  }
  /* 隐藏趋势图标在极小屏 */
  .hi-trend { display: none; }
  .hi-plays { font-size: 11px; }
  .rank { font-size: 13px; }
  .hi-cover { width: 38px; height: 38px; }
  .chart-box { height: 160px; }
  .chart-box-sm { height: 150px; }
  .chart-box-bar { height: 200px; }
}
</style>
