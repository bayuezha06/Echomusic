# 🎵 EchoMusic — 音乐社区平台

> 基于 Vue3 构建的音乐社区平台，支持歌曲播放、歌词同步、歌单管理、收藏管理及热门歌曲统计等功能。

**在线演示：** https://bayuezha06.github.io/Echomusic/

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.4 | 核心框架，Composition API |
| Pinia | ^2.1 | 全局状态管理 |
| Vue Router | ^4.3 | 客户端路由，懒加载 |
| Element Plus | ^2.6 | UI 组件库 |
| ECharts | ^5.4 | 数据可视化图表 |
| Web Audio API | 原生 | 音频合成引擎 + 频谱可视化 |
| Vite | ^5.2 | 构建工具 |

---

## 项目亮点

### 🎛️ 播放器状态统一管理
基于 Pinia 的 `usePlayerStore` 统一管理播放状态、当前歌曲、播放队列、音量等全局数据，页面切换后播放状态完全保持。

### 🎤 歌词同步与交互优化
- 自定义 LRC 解析器，支持多时间标签格式
- 歌词自动滚动至当前行居中显示
- 支持点击任意歌词行跳转到对应时间点

### ⚙️ 播放器核心功能
- 三种播放模式：顺序播放 / 随机播放 / 单曲循环
- 进度条拖拽跳转，音量调节与静音
- 播放队列管理：添加、移除、拖拽排序
- 底部频谱可视化（基于 Web Audio API AnalyserNode）

### 🧩 组件封装
- `PlayerBar` — 底部全功能播放控制栏
- `LyricsPanel` — 歌词全屏浮层
- `PlaylistDrawer` — 播放队列侧抽屉
- `SongCard` / `SongListItem` — 两种歌曲展示形态

### 📊 数据可视化
使用 ECharts 实现：
- 热歌排行播放量柱状图
- 近 7 天 / 30 天播放趋势折线图
- 曲风分布环形图
- 用户音乐品味雷达图
- 月度听歌时长柱状图

### 📱 移动端适配
- 手机端隐藏侧边栏，切换为底部 Tab 导航（Spotify 风格）
- 播放器在移动端压缩为紧凑单行，底部实时进度条
- 所有页面 Grid 布局响应式断点（1100px / 800px / 480px）

---

## 功能页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | Hero Banner、精选歌单、热门歌曲、最近播放 |
| 音乐库 | `/discover` | 全量歌曲列表，支持搜索和曲风筛选 |
| 热歌榜 | `/charts` | Top 15 排行 + ECharts 多维度统计图 |
| 歌单详情 | `/playlist/:id` | 歌单信息、歌曲列表、一键播放 |
| 我的收藏 | `/favorites` | 收藏歌曲管理、播放历史 |
| 个人中心 | `/profile` | 用户数据统计、品味雷达图 |

---

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---

## 项目结构

```
src/
├── assets/styles/     # 全局 CSS 变量与样式
├── components/
│   ├── common/        # SongCard、SongListItem
│   ├── layout/        # AppSidebar、BottomNav
│   └── player/        # PlayerBar、LyricsPanel、PlaylistDrawer
├── mock/              # 歌曲数据、歌单数据、统计数据
├── router/            # 路由配置（懒加载）
├── stores/            # Pinia：player、playlist、favorites
├── utils/             # audioEngine.js、lyricsParser.js
└── views/             # 6 个页面视图
```

---

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署至 GitHub Pages。
