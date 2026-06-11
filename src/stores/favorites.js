import { songs } from '@/mock/songs.js'
import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoritedIds: new Set([1, 3, 6, 15, 20]),
    history: [1, 20, 3, 15, 6, 10, 8, 2, 9, 4]
  }),

  getters: {
    favoriteSongs: (state) => {
      return songs.filter(s => state.favoritedIds.has(s.id))
    },
    isFavorited: (state) => (songId) => {
      return songId != null && state.favoritedIds.has(songId)
    },
    recentHistory: (state) => {
      return state.history.slice(0, 20)
        .map(id => songs.find(s => s.id === id))
        .filter(Boolean)
    }
  },

  actions: {
    toggleFavorite(songId) {
      if (this.favoritedIds.has(songId)) {
        this.favoritedIds.delete(songId)
      } else {
        this.favoritedIds.add(songId)
      }
    },

    addFavorite(songId) {
      this.favoritedIds.add(songId)
    },

    removeFavorite(songId) {
      this.favoritedIds.delete(songId)
    },

    addToHistory(songId) {
      this.history = [songId, ...this.history.filter(id => id !== songId)].slice(0, 50)
    }
  }
})
