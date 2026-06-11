import { playlists as mockPlaylists } from '@/mock/playlists.js'
import { songs } from '@/mock/songs.js'
import { defineStore } from 'pinia'

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlists: [...mockPlaylists],
    userPlaylists: [
      {
        id: 101,
        name: '我喜欢的音乐',
        description: '自动收集我喜欢的歌曲',
        cover: 'https://picsum.photos/seed/mylike/300/300',
        songIds: [1, 6, 10, 15, 20],
        creator: '我',
        playCount: 0,
        tags: ['我的', '收藏']
      }
    ]
  }),

  getters: {
    allPlaylists: (state) => [...state.playlists, ...state.userPlaylists],
    getPlaylistById: (state) => (id) => {
      return state.playlists.find(p => p.id === id) ||
             state.userPlaylists.find(p => p.id === id)
    }
  },

  actions: {
    getPlaylistSongs(id) {
      const pl = this.getPlaylistById(id)
      if (!pl) return []
      return pl.songIds.map(sid => songs.find(s => s.id === sid)).filter(Boolean)
    },

    createPlaylist(name, description = '') {
      const newId = Date.now()
      const pl = {
        id: newId,
        name,
        description,
        cover: `https://picsum.photos/seed/${newId}/300/300`,
        songIds: [],
        creator: '我',
        playCount: 0,
        tags: ['我的']
      }
      this.userPlaylists.push(pl)
      return pl
    },

    deletePlaylist(id) {
      const idx = this.userPlaylists.findIndex(p => p.id === id)
      if (idx !== -1) this.userPlaylists.splice(idx, 1)
    },

    addSongToPlaylist(playlistId, songId) {
      const pl = this.userPlaylists.find(p => p.id === playlistId)
      if (pl && !pl.songIds.includes(songId)) {
        pl.songIds.push(songId)
      }
    },

    removeSongFromPlaylist(playlistId, songId) {
      const pl = this.getPlaylistById(playlistId)
      if (!pl) return
      const idx = pl.songIds.indexOf(songId)
      if (idx !== -1) pl.songIds.splice(idx, 1)
    }
  }
})
