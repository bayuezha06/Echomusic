// Web Audio API 合成引擎
// 使用 Web Audio API 实时合成音频，无需外部音频文件

const SEMITONE = Math.pow(2, 1 / 12)
const PENTATONIC = [0, 2, 4, 7, 9] // 五声音阶半音偏移

function getFrequency(rootHz, noteIndex) {
  if (noteIndex < 0) return 0
  const octave = Math.floor(noteIndex / PENTATONIC.length)
  const degree = noteIndex % PENTATONIC.length
  return rootHz * Math.pow(SEMITONE, PENTATONIC[degree] + octave * 12)
}

function generateBuffer(ctx, config) {
  const { rootHz, tempo, melody, wave } = config
  const sampleRate = ctx.sampleRate
  const noteDuration = 60 / tempo / 2 // 八分音符
  const loopSecs = melody.length * noteDuration
  const bufferLength = Math.ceil(sampleRate * loopSecs)
  const buffer = ctx.createBuffer(2, bufferLength, sampleRate)

  const L = buffer.getChannelData(0)
  const R = buffer.getChannelData(1)

  for (let i = 0; i < bufferLength; i++) {
    const t = i / sampleRate
    const noteIdx = Math.floor(t / noteDuration) % melody.length
    const noteT = t % noteDuration
    const noteNum = melody[noteIdx]

    if (noteNum < 0) { L[i] = 0; R[i] = 0; continue }

    const freq = getFrequency(rootHz, noteNum)

    // ADSR 包络
    const attack = 0.012
    const decay = 0.07
    const sustain = 0.5
    const release = Math.min(0.05, noteDuration * 0.18)
    const noteEnd = noteDuration - 0.003

    let env
    if (noteT < attack) env = noteT / attack
    else if (noteT < attack + decay) env = 1 - (1 - sustain) * (noteT - attack) / decay
    else if (noteT < noteEnd - release) env = sustain
    else if (noteT < noteEnd) env = sustain * (1 - (noteT - (noteEnd - release)) / release)
    else env = 0

    // 波形生成
    let sample
    const p = 2 * Math.PI * freq * t
    if (wave === 'triangle') {
      const x = (freq * t) % 1
      sample = x < 0.5 ? 4 * x - 1 : 3 - 4 * x
    } else if (wave === 'sawtooth') {
      sample = 2 * ((freq * t) % 1) - 1
    } else {
      // sine + 泛音增加温暖感
      sample = Math.sin(p) + 0.28 * Math.sin(p * 2) + 0.08 * Math.sin(p * 3)
      sample /= 1.36
    }

    // 轻微低音
    const bass = Math.sin(2 * Math.PI * (rootHz / 2) * t) * 0.18
    const amp = 0.22 * env
    L[i] = (sample + bass) * amp
    R[i] = (sample * 0.94 + bass) * amp
  }
  return buffer
}

class AudioEngine {
  constructor() {
    this._ctx = null
    this._masterGain = null
    this._analyser = null
    this._source = null
    this._isPlaying = false
    this._currentSong = null
    this._songDuration = 0
    this._startCtxTime = 0
    this._pausedAt = 0
    this._bufferCache = new Map()
    this._tickTimer = null
    this.onTimeUpdate = null
    this.onEnded = null
  }

  _init() {
    if (this._ctx) {
      if (this._ctx.state === 'suspended') this._ctx.resume()
      return
    }
    this._ctx = new (window.AudioContext || window.webkitAudioContext)()
    this._analyser = this._ctx.createAnalyser()
    this._analyser.fftSize = 256
    this._masterGain = this._ctx.createGain()
    this._masterGain.gain.value = 0.8
    this._masterGain.connect(this._analyser)
    this._analyser.connect(this._ctx.destination)
  }

  _getOrCreateBuffer(song) {
    if (this._bufferCache.has(song.id)) return this._bufferCache.get(song.id)
    const buffer = generateBuffer(this._ctx, song.synthesis)
    this._bufferCache.set(song.id, buffer)
    return buffer
  }

  _stopSource() {
    if (this._source) {
      try { this._source.stop() } catch (e) { /* already stopped */ }
      this._source.disconnect()
      this._source = null
    }
    this._stopTick()
  }

  _startSource(song, fromTime) {
    const buffer = this._getOrCreateBuffer(song)
    this._source = this._ctx.createBufferSource()
    this._source.buffer = buffer
    this._source.loop = true
    this._source.connect(this._masterGain)
    const loopOffset = fromTime % buffer.duration
    this._source.start(0, loopOffset)
    this._startCtxTime = this._ctx.currentTime - fromTime
    this._isPlaying = true
    this._startTick()
  }

  getCurrentTime() {
    if (this._isPlaying) return this._ctx.currentTime - this._startCtxTime
    return this._pausedAt
  }

  _startTick() {
    this._stopTick()
    this._tickTimer = setInterval(() => {
      const t = this.getCurrentTime()
      if (this.onTimeUpdate) this.onTimeUpdate(Math.min(t, this._songDuration))
      if (t >= this._songDuration) {
        this._stopSource()
        this._pausedAt = 0
        this._isPlaying = false
        if (this.onEnded) this.onEnded()
      }
    }, 200)
  }

  _stopTick() {
    if (this._tickTimer) { clearInterval(this._tickTimer); this._tickTimer = null }
  }

  play(song) {
    this._init()
    if (this._ctx.state === 'suspended') this._ctx.resume()
    if (this._currentSong?.id === song.id && !this._isPlaying && this._pausedAt > 0) {
      this._startSource(song, this._pausedAt)
    } else {
      this._stopSource()
      this._pausedAt = 0
      this._currentSong = song
      this._songDuration = song.duration
      this._startSource(song, 0)
    }
  }

  pause() {
    if (!this._isPlaying) return
    this._pausedAt = this.getCurrentTime()
    this._stopSource()
    this._isPlaying = false
  }

  resume() {
    if (this._isPlaying || !this._currentSong) return
    this._init()
    if (this._ctx.state === 'suspended') this._ctx.resume()
    this._startSource(this._currentSong, this._pausedAt)
  }

  seek(time) {
    if (!this._currentSong) return
    const wasPlaying = this._isPlaying
    this._stopSource()
    this._pausedAt = Math.max(0, Math.min(time, this._songDuration))
    this._isPlaying = false
    if (wasPlaying) this._startSource(this._currentSong, this._pausedAt)
  }

  setVolume(vol) {
    if (this._masterGain) {
      this._masterGain.gain.setTargetAtTime(
        Math.max(0, Math.min(1, vol)),
        this._ctx ? this._ctx.currentTime : 0,
        0.015
      )
    }
  }

  getFrequencyData() {
    if (!this._analyser) return new Uint8Array(128).fill(0)
    const data = new Uint8Array(this._analyser.frequencyBinCount)
    this._analyser.getByteFrequencyData(data)
    return data
  }

  isActive() { return this._isPlaying }

  stop() {
    this._stopSource()
    this._pausedAt = 0
    this._isPlaying = false
    this._currentSong = null
  }
}

export const audioEngine = new AudioEngine()
