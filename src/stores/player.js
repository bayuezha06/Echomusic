import { audioEngine } from '@/utils/audioEngine'
import { formatTime } from '@/utils/lyricsParser'
import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentSong: null,
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    playMode: 'sequence', // 'sequence' | 'random' | 'loop'
    showLyrics: false,
    showPlaylist: false,
    isLoading: false
  }),

  getters: {
    progress: (state) => state.duration > 0 ? state.currentTime / state.duration : 0,
    formattedCurrentTime: (state) => formatTime(state.currentTime),
    formattedDuration: (state) => formatTime(state.duration),
    modeLabel: (state) => {
      const labels = { sequence: '顺序播放', random: '随机播放', loop: '单曲循环' }
      return labels[state.playMode] || '顺序播放'
    }
  },

  actions: {
    _bindEngine() {
      audioEngine.onTimeUpdate = (time) => { this.currentTime = time }
      audioEngine.onEnded = () => {
        this.isPlaying = false
        if (this.playMode !== 'loop') {
          this.playNext()
        } else {
          // Single loop: replay current song
          this._doPlay(this.currentSong)
        }
      }
    },

    _doPlay(song) {
      this._bindEngine()
      this.currentSong = song
      this.duration = song.duration
      this.currentTime = 0
      this.isLoading = true
      audioEngine.play(song)
      this.isLoading = false
      this.isPlaying = true
      audioEngine.setVolume(this.isMuted ? 0 : this.volume)
    },

    playSong(song, queue = null) {
      if (queue && queue.length > 0) {
        this.queue = [...queue]
        const idx = queue.findIndex(s => s.id === song.id)
        this.currentIndex = idx >= 0 ? idx : 0
      } else {
        if (!this.queue.some(s => s.id === song.id)) {
          this.queue.push(song)
        }
        this.currentIndex = this.queue.findIndex(s => s.id === song.id)
      }
      this._doPlay(song)
    },

    togglePlay() {
      if (!this.currentSong) return
      if (this.isPlaying) {
        audioEngine.pause()
        this.isPlaying = false
      } else {
        audioEngine.resume()
        this.isPlaying = true
      }
    },

    playNext() {
      if (!this.queue.length) return
      let nextIdx
      if (this.playMode === 'random') {
        nextIdx = Math.floor(Math.random() * this.queue.length)
      } else {
        nextIdx = (this.currentIndex + 1) % this.queue.length
      }
      this.currentIndex = nextIdx
      this._doPlay(this.queue[nextIdx])
    },

    playPrev() {
      if (!this.queue.length) return
      if (this.currentTime > 3) {
        this.seek(0)
        return
      }
      let prevIdx
      if (this.playMode === 'random') {
        prevIdx = Math.floor(Math.random() * this.queue.length)
      } else {
        prevIdx = (this.currentIndex - 1 + this.queue.length) % this.queue.length
      }
      this.currentIndex = prevIdx
      this._doPlay(this.queue[prevIdx])
    },

    seek(time) {
      this.currentTime = time
      audioEngine.seek(time)
    },

    setVolume(vol) {
      this.volume = Math.max(0, Math.min(1, vol))
      if (!this.isMuted) audioEngine.setVolume(this.volume)
    },

    toggleMute() {
      this.isMuted = !this.isMuted
      audioEngine.setVolume(this.isMuted ? 0 : this.volume)
    },

    setPlayMode(mode) {
      this.playMode = mode
    },

    cyclePlayMode() {
      const modes = ['sequence', 'random', 'loop']
      const idx = modes.indexOf(this.playMode)
      this.playMode = modes[(idx + 1) % modes.length]
    },

    addToQueue(song) {
      if (!this.queue.some(s => s.id === song.id)) {
        this.queue.push(song)
      }
    },

    removeFromQueue(songId) {
      const idx = this.queue.findIndex(s => s.id === songId)
      if (idx === -1) return
      this.queue.splice(idx, 1)
      if (idx < this.currentIndex) {
        this.currentIndex--
      } else if (idx === this.currentIndex) {
        if (!this.queue.length) {
          audioEngine.stop()
          this.currentSong = null
          this.isPlaying = false
          this.currentTime = 0
        } else {
          const nextIdx = Math.min(this.currentIndex, this.queue.length - 1)
          this.currentIndex = nextIdx
          this._doPlay(this.queue[nextIdx])
        }
      }
    },

    playFromQueue(index) {
      if (index < 0 || index >= this.queue.length) return
      this.currentIndex = index
      this._doPlay(this.queue[index])
    },

    clearQueue() {
      audioEngine.stop()
      this.queue = []
      this.currentIndex = -1
      this.currentSong = null
      this.isPlaying = false
      this.currentTime = 0
    }
  }
})
