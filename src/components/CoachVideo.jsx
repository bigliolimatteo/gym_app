import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react'

/**
 * Player video coach interno all'app (HTML5 <video>, niente YouTube).
 * - Se viene passato `src`, mostra il vero player con controlli custom e overlay
 *   con i punti su cui concentrarsi (cue come "scapole addotte", "spingi avanti").
 * - Se `src` non è fornito, mostra una "preview coach" elegante che scorre i cue
 *   in loop come fossero sottotitoli del coach: l'utente vede comunque il valore
 *   che il video porterà, e l'asset video può essere agganciato in seguito.
 */
export default function CoachVideo({
  src,
  poster,
  coachName = 'Coach GymTracker',
  durationLabel = '~45 sec',
  focusPoints = [],
}) {
  if (src) {
    return <RealVideo src={src} poster={poster} coachName={coachName} focusPoints={focusPoints} />
  }
  return <PlaceholderCoach coachName={coachName} durationLabel={durationLabel} focusPoints={focusPoints} />
}

function RealVideo({ src, poster, coachName, focusPoints }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeCueIdx, setActiveCueIdx] = useState(0)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => {
      const p = v.duration ? v.currentTime / v.duration : 0
      setProgress(p)
      if (focusPoints.length > 0) {
        setActiveCueIdx(Math.min(focusPoints.length - 1, Math.floor(p * focusPoints.length)))
      }
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    return () => {
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
    }
  }, [focusPoints.length])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play()
    else v.pause()
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black shadow-sm border border-gray-100">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        className="w-full aspect-video bg-black object-cover"
        onClick={togglePlay}
      />

      {/* Top bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/90 bg-black/40 backdrop-blur px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3" />
          {coachName}
        </div>
      </div>

      {/* Active cue subtitle */}
      {focusPoints.length > 0 && (
        <div className="absolute bottom-14 left-3 right-3 text-center">
          <div className="inline-block bg-black/60 backdrop-blur text-white text-sm font-semibold px-3 py-1.5 rounded-lg max-w-full">
            {focusPoints[activeCueIdx]}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-6 bg-gradient-to-t from-black/70 to-transparent flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-white text-gray-900 flex items-center justify-center shadow"
          aria-label={playing ? 'Pausa' : 'Play'}
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <div className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden">
          <div className="h-full bg-primary-400" style={{ width: `${progress * 100}%` }} />
        </div>
        <button
          type="button"
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-white/15 text-white flex items-center justify-center"
          aria-label={muted ? 'Riattiva audio' : 'Disattiva audio'}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

function PlaceholderCoach({ coachName, durationLabel, focusPoints }) {
  const [active, setActive] = useState(0)
  const safeCues = focusPoints.length > 0 ? focusPoints : ['Mantieni la tecnica', 'Movimento controllato']

  useEffect(() => {
    const t = setInterval(() => {
      setActive((i) => (i + 1) % safeCues.length)
    }, 2200)
    return () => clearInterval(t)
  }, [safeCues.length])

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600">
      <div className="aspect-video w-full p-5 flex flex-col justify-between text-white">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            Video coach · {coachName}
          </div>
          <span className="text-[11px] text-white/70">{durationLabel}</span>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
            <Play className="w-7 h-7 ml-1" fill="currentColor" />
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/70 mb-1">Focus del coach</p>
          <div className="bg-white/10 backdrop-blur rounded-xl px-3 py-2 min-h-[2.5rem] flex items-center">
            <span key={active} className="text-sm font-semibold animate-[fadeIn_0.4s_ease-out]">
              {safeCues[active]}
            </span>
          </div>
        </div>
      </div>
      <div className="px-5 pb-3 -mt-1 text-[11px] text-white/70 text-center">
        Video in arrivo · I cue sotto sono già quelli su cui il coach ti farà concentrare
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
