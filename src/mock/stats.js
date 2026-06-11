// ECharts 图表所用的统计数据

export const hotSongs = [
  { rank: 1,  id: 20, title: '青花瓷',    artist: '周杰伦',       plays: 18542310, trend: 'up',   change: 0 },
  { rank: 2,  id: 1,  title: '晴天',      artist: '周杰伦',       plays: 16231800, trend: 'down', change: 1 },
  { rank: 3,  id: 15, title: '起风了',    artist: '买辣椒也用券', plays: 14987600, trend: 'up',   change: 2 },
  { rank: 4,  id: 3,  title: '七里香',    artist: '周杰伦',       plays: 13245000, trend: 'same', change: 0 },
  { rank: 5,  id: 8,  title: '平凡之路',  artist: '朴树',         plays: 12890000, trend: 'up',   change: 3 },
  { rank: 6,  id: 13, title: '后来',      artist: '刘若英',       plays: 11654300, trend: 'down', change: 2 },
  { rank: 7,  id: 6,  title: '光年之外',  artist: 'G.E.M.邓紫棋', plays: 10321500, trend: 'up',   change: 1 },
  { rank: 8,  id: 16, title: '漠河舟',    artist: '柳爽',         plays: 9876200,  trend: 'up',   change: 5 },
  { rank: 9,  id: 5,  title: '稻香',      artist: '周杰伦',       plays: 9123400,  trend: 'down', change: 1 },
  { rank: 10, id: 17, title: '错位时空',  artist: '艾辰',         plays: 8654100,  trend: 'up',   change: 4 },
  { rank: 11, id: 4,  title: '告白气球',  artist: '周杰伦',       plays: 8210000,  trend: 'down', change: 3 },
  { rank: 12, id: 9,  title: '那些年',    artist: '胡夏',         plays: 7890500,  trend: 'same', change: 0 },
  { rank: 13, id: 11, title: '演员',      artist: '薛之谦',       plays: 7543200,  trend: 'up',   change: 2 },
  { rank: 14, id: 10, title: '小幸运',    artist: '田馥甄',       plays: 7123800,  trend: 'down', change: 2 },
  { rank: 15, id: 2,  title: '夜曲',      artist: '周杰伦',       plays: 6987100,  trend: 'up',   change: 1 },
]

export const weeklyTrend = {
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  data: [1240, 1380, 1520, 1180, 1640, 2100, 1890]
}

export const monthlyTrend = {
  labels: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
  data: [
    980, 1050, 1200, 1100, 1350, 1480, 1560,
    1420, 1380, 1510, 1620, 1700, 1580, 1490,
    1650, 1720, 1800, 1750, 1690, 1810, 1930,
    1870, 2010, 2150, 2080, 2200, 2350, 2280, 2180, 2310
  ]
}

export const genreDistribution = [
  { name: '华语流行', value: 42 },
  { name: '民谣',     value: 16 },
  { name: 'R&B',      value: 12 },
  { name: '摇滚',     value: 10 },
  { name: '电子',     value: 9  },
  { name: '古典',     value: 7  },
  { name: '其他',     value: 4  }
]

export const userListeningHours = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  data: [42, 55, 48, 63, 71, 88]
}

export const userTasteRadar = {
  indicators: [
    { name: '华语流行', max: 100 },
    { name: '电子音乐', max: 100 },
    { name: '民谣',     max: 100 },
    { name: '摇滚',     max: 100 },
    { name: 'R&B',      max: 100 },
    { name: '古典',     max: 100 }
  ],
  data: [85, 40, 72, 35, 60, 28]
}
