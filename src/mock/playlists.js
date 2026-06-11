import { songs } from './songs.js'

export const playlists = [
  {
    id: 1,
    name: '周杰伦精选集',
    description: '收录周杰伦最经典的华语流行歌曲，每一首都是时代的印记',
    cover: 'https://picsum.photos/seed/playlist1/300/300',
    songIds: [1, 2, 3, 4, 5, 18, 19, 20],
    creator: 'EchoMusic编辑',
    playCount: 8542310,
    tags: ['华语', '流行', '经典']
  },
  {
    id: 2,
    name: '深夜情歌',
    description: '在深夜，让这些歌声陪伴你，治愈每一个孤独的瞬间',
    cover: 'https://picsum.photos/seed/playlist2/300/300',
    songIds: [2, 7, 13, 15, 16, 11, 17],
    creator: '夜听音乐',
    playCount: 5231800,
    tags: ['情歌', '治愈', '深夜']
  },
  {
    id: 3,
    name: '青春回忆',
    description: '那些年的青春，那些年的歌，每一首都是最美好的记忆',
    cover: 'https://picsum.photos/seed/playlist3/300/300',
    songIds: [9, 10, 8, 6, 14, 12],
    creator: '时光音乐',
    playCount: 3987600,
    tags: ['青春', '校园', '回忆']
  },
  {
    id: 4,
    name: '元气早安歌单',
    description: '用音乐开启美好的一天，充满活力，迎接新的挑战',
    cover: 'https://picsum.photos/seed/playlist4/300/300',
    songIds: [4, 9, 10, 14, 3, 6],
    creator: '活力音乐站',
    playCount: 2145000,
    tags: ['活力', '晨间', '治愈']
  },
  {
    id: 5,
    name: '华语经典100首',
    description: '精心整理的华语流行经典，跨越时代的动人旋律',
    cover: 'https://picsum.photos/seed/playlist5/300/300',
    songIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    creator: 'EchoMusic精选',
    playCount: 12890000,
    tags: ['华语', '经典', '必听']
  }
]

export function getPlaylistSongs(playlistId) {
  const pl = playlists.find(p => p.id === playlistId)
  if (!pl) return []
  return pl.songIds.map(id => songs.find(s => s.id === id)).filter(Boolean)
}

export const playlistMap = Object.fromEntries(playlists.map(p => [p.id, p]))
