import { useId } from 'react'
import { Activity } from 'lucide-react'

/**
 * Anteprima animata del movimento dell'esercizio.
 * Stile pittogramma stile-app (Fitbod / Nike Training): mostra a grandi linee
 * la traiettoria, non l'anatomia precisa. Il pattern viene mappato a una
 * piccola scena SVG con animazioni CSS in loop.
 */
export default function MovementAnimation({ pattern, accentClass = 'bg-primary-500', label }) {
  const id = useId().replace(/:/g, '')

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-sm border border-gray-100">
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-white/80 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full">
        <Activity className="w-3 h-3" />
        Anteprima movimento
      </div>
      {label && (
        <div className="absolute bottom-3 left-3 right-3 text-xs text-white/70 text-center font-medium tracking-wide uppercase">
          {label}
        </div>
      )}

      <div className="aspect-[16/9] w-full flex items-center justify-center">
        <Scene pattern={pattern} idPrefix={id} accentClass={accentClass} />
      </div>

      <style>{getKeyframes(id)}</style>
    </div>
  )
}

function Scene({ pattern, idPrefix }) {
  switch (pattern) {
    case 'push-bench':
      return <PushBench id={idPrefix} />
    case 'push-overhead':
      return <PushOverhead id={idPrefix} />
    case 'push-incline':
      return <PushIncline id={idPrefix} />
    case 'pull-vertical':
      return <PullVertical id={idPrefix} />
    case 'pull-horizontal':
      return <PullHorizontal id={idPrefix} />
    case 'chest-fly':
      return <ChestFly id={idPrefix} />
    case 'lateral-raise':
      return <LateralRaise id={idPrefix} />
    case 'front-raise':
      return <FrontRaise id={idPrefix} />
    case 'face-pull':
      return <FacePull id={idPrefix} />
    case 'curl':
      return <Curl id={idPrefix} />
    case 'pushdown':
      return <Pushdown id={idPrefix} />
    case 'triceps-extension':
      return <TricepsExtension id={idPrefix} />
    case 'dip':
      return <Dip id={idPrefix} />
    case 'squat':
      return <Squat id={idPrefix} />
    case 'leg-press':
      return <LegPress id={idPrefix} />
    case 'lunge':
      return <Lunge id={idPrefix} />
    case 'leg-curl':
      return <LegCurl id={idPrefix} />
    case 'leg-extension':
      return <LegExtension id={idPrefix} />
    case 'deadlift':
      return <Deadlift id={idPrefix} />
    case 'hip-thrust':
      return <HipThrust id={idPrefix} />
    case 'glute-kickback':
      return <GluteKickback id={idPrefix} />
    case 'crunch':
      return <Crunch id={idPrefix} />
    case 'plank':
      return <Plank id={idPrefix} />
    case 'twist':
      return <Twist id={idPrefix} />
    case 'wrist-curl':
      return <WristCurl id={idPrefix} />
    case 'calf-raise':
      return <CalfRaise id={idPrefix} />
    default:
      return <Generic id={idPrefix} />
  }
}

const STROKE = '#f8fafc'
const ACCENT = '#60a5fa'
const FLOOR = '#1f2937'

function Floor({ y = 92 }) {
  return <line x1="5" y1={y} x2="95" y2={y} stroke={FLOOR} strokeWidth="0.7" strokeLinecap="round" />
}

function Bar({ id, anim, x = 30, y = 40, length = 40 }) {
  return (
    <g style={{ animation: `${anim} 2.4s ease-in-out infinite` }}>
      <line x1={x} y1={y} x2={x + length} y2={y} stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
      <circle cx={x} cy={y} r="2" fill={ACCENT} />
      <circle cx={x + length} cy={y} r="2" fill={ACCENT} />
      {id /* Avoid unused warning */}
    </g>
  )
}

const baseSvg = (children, viewBox = '0 0 100 100') => (
  <svg viewBox={viewBox} className="w-3/4 h-3/4" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
    {children}
  </svg>
)

function PushBench({ id }) {
  return baseSvg(
    <>
      <Floor y={92} />
      {/* Bench */}
      <rect x="22" y="62" width="56" height="6" rx="1.2" fill={FLOOR} stroke={FLOOR} />
      <line x1="28" y1="68" x2="28" y2="86" stroke={FLOOR} strokeWidth="1.2" />
      <line x1="72" y1="68" x2="72" y2="86" stroke={FLOOR} strokeWidth="1.2" />
      {/* Stick figure on bench */}
      <circle cx="80" cy="58" r="3.2" fill={STROKE} />
      <line x1="76" y1="62" x2="30" y2="62" />
      {/* Legs */}
      <line x1="30" y1="62" x2="22" y2="86" />
      <line x1="22" y1="86" x2="28" y2="86" />
      {/* Arms (animated push) */}
      <g style={{ animation: `${id}-press 2.4s ease-in-out infinite`, transformOrigin: '60px 62px' }}>
        <line x1="60" y1="62" x2="60" y2="40" />
        <line x1="55" y1="62" x2="55" y2="40" />
        <Bar id={id} anim={`${id}-bar`} x="48" y="38" length="22" />
      </g>
    </>
  )
}

function PushOverhead({ id }) {
  return baseSvg(
    <>
      <Floor />
      {/* Body */}
      <circle cx="50" cy="32" r="3.5" fill={STROKE} />
      <line x1="50" y1="35.5" x2="50" y2="70" />
      <line x1="50" y1="70" x2="42" y2="92" />
      <line x1="50" y1="70" x2="58" y2="92" />
      {/* Arms */}
      <g style={{ animation: `${id}-press 2.4s ease-in-out infinite`, transformOrigin: '50px 40px' }}>
        <line x1="50" y1="40" x2="38" y2="22" />
        <line x1="50" y1="40" x2="62" y2="22" />
        <Bar id={id} anim={`${id}-bar-up`} x="32" y="20" length="36" />
      </g>
    </>
  )
}

function PushIncline({ id }) {
  return baseSvg(
    <>
      <Floor />
      {/* Inclined bench */}
      <line x1="22" y1="86" x2="78" y2="50" stroke={FLOOR} strokeWidth="3" />
      <line x1="22" y1="86" x2="22" y2="92" stroke={FLOOR} strokeWidth="1.2" />
      <line x1="78" y1="50" x2="78" y2="92" stroke={FLOOR} strokeWidth="1.2" />
      {/* Stick figure inclined */}
      <circle cx="74" cy="46" r="3" fill={STROKE} />
      <line x1="71" y1="48" x2="35" y2="72" />
      {/* Arms */}
      <g style={{ animation: `${id}-press 2.4s ease-in-out infinite`, transformOrigin: '60px 56px' }}>
        <line x1="60" y1="56" x2="50" y2="32" />
        <line x1="55" y1="60" x2="45" y2="36" />
        <Bar id={id} anim={`${id}-bar-incline`} x="38" y="32" length="20" />
      </g>
    </>
  )
}

function PullVertical({ id }) {
  return baseSvg(
    <>
      <Floor />
      {/* Top bar */}
      <line x1="20" y1="14" x2="80" y2="14" stroke={ACCENT} strokeWidth="2.4" />
      {/* Body */}
      <circle cx="50" cy="38" r="3.5" fill={STROKE} />
      <line x1="50" y1="41.5" x2="50" y2="74" />
      <line x1="50" y1="74" x2="42" y2="92" />
      <line x1="50" y1="74" x2="58" y2="92" />
      {/* Arms (pull) */}
      <g style={{ animation: `${id}-pull 2.4s ease-in-out infinite`, transformOrigin: '50px 42px' }}>
        <line x1="50" y1="42" x2="38" y2="20" />
        <line x1="50" y1="42" x2="62" y2="20" />
        <line x1="38" y1="20" x2="36" y2="14" />
        <line x1="62" y1="20" x2="64" y2="14" />
      </g>
    </>
  )
}

function PullHorizontal({ id }) {
  return baseSvg(
    <>
      <Floor />
      {/* Hinged stick figure */}
      <line x1="20" y1="86" x2="38" y2="92" />
      <line x1="38" y1="92" x2="46" y2="92" />
      {/* Torso angled */}
      <line x1="32" y1="58" x2="62" y2="76" />
      <circle cx="30" cy="56" r="3.2" fill={STROKE} />
      {/* Legs */}
      <line x1="62" y1="76" x2="58" y2="92" />
      <line x1="62" y1="76" x2="68" y2="92" />
      {/* Arms (row) */}
      <g style={{ animation: `${id}-row 2.4s ease-in-out infinite`, transformOrigin: '46px 66px' }}>
        <line x1="46" y1="66" x2="74" y2="80" />
        <Bar id={id} anim={`${id}-bar-row`} x="68" y="78" length="14" />
      </g>
    </>
  )
}

function ChestFly({ id }) {
  return baseSvg(
    <>
      <Floor />
      <circle cx="50" cy="34" r="3.5" fill={STROKE} />
      <line x1="50" y1="37.5" x2="50" y2="74" />
      <line x1="50" y1="74" x2="42" y2="92" />
      <line x1="50" y1="74" x2="58" y2="92" />
      {/* Arms fly */}
      <g style={{ animation: `${id}-fly-l 2.6s ease-in-out infinite`, transformOrigin: '50px 46px' }}>
        <line x1="50" y1="46" x2="22" y2="46" />
        <circle cx="22" cy="46" r="2" fill={ACCENT} />
      </g>
      <g style={{ animation: `${id}-fly-r 2.6s ease-in-out infinite`, transformOrigin: '50px 46px' }}>
        <line x1="50" y1="46" x2="78" y2="46" />
        <circle cx="78" cy="46" r="2" fill={ACCENT} />
      </g>
    </>
  )
}

function LateralRaise({ id }) {
  return baseSvg(
    <>
      <Floor />
      <circle cx="50" cy="32" r="3.5" fill={STROKE} />
      <line x1="50" y1="35.5" x2="50" y2="70" />
      <line x1="50" y1="70" x2="42" y2="92" />
      <line x1="50" y1="70" x2="58" y2="92" />
      <g style={{ animation: `${id}-lat-l 2.4s ease-in-out infinite`, transformOrigin: '50px 42px' }}>
        <line x1="50" y1="42" x2="30" y2="42" />
        <circle cx="30" cy="42" r="2.2" fill={ACCENT} />
      </g>
      <g style={{ animation: `${id}-lat-r 2.4s ease-in-out infinite`, transformOrigin: '50px 42px' }}>
        <line x1="50" y1="42" x2="70" y2="42" />
        <circle cx="70" cy="42" r="2.2" fill={ACCENT} />
      </g>
    </>
  )
}

function FrontRaise({ id }) {
  return baseSvg(
    <>
      <Floor />
      <circle cx="50" cy="32" r="3.5" fill={STROKE} />
      <line x1="50" y1="35.5" x2="50" y2="70" />
      <line x1="50" y1="70" x2="42" y2="92" />
      <line x1="50" y1="70" x2="58" y2="92" />
      <g style={{ animation: `${id}-front 2.6s ease-in-out infinite`, transformOrigin: '50px 42px' }}>
        <line x1="50" y1="42" x2="50" y2="62" />
        <circle cx="50" cy="62" r="2.4" fill={ACCENT} />
      </g>
    </>
  )
}

function FacePull({ id }) {
  return baseSvg(
    <>
      <Floor />
      {/* Cable column */}
      <line x1="14" y1="14" x2="14" y2="92" stroke={FLOOR} strokeWidth="1.5" />
      <circle cx="14" cy="36" r="1.6" fill={ACCENT} />
      <circle cx="50" cy="38" r="3.5" fill={STROKE} />
      <line x1="50" y1="41.5" x2="50" y2="74" />
      <line x1="50" y1="74" x2="42" y2="92" />
      <line x1="50" y1="74" x2="58" y2="92" />
      {/* Cable + arms */}
      <g style={{ animation: `${id}-face 2.6s ease-in-out infinite` }}>
        <line x1="14" y1="36" x2="46" y2="38" stroke={ACCENT} strokeDasharray="2 1.5" />
        <line x1="50" y1="44" x2="40" y2="34" />
        <line x1="50" y1="44" x2="40" y2="42" />
      </g>
    </>
  )
}

function Curl({ id }) {
  return baseSvg(
    <>
      <Floor />
      <circle cx="50" cy="30" r="3.5" fill={STROKE} />
      <line x1="50" y1="33.5" x2="50" y2="70" />
      <line x1="50" y1="70" x2="42" y2="92" />
      <line x1="50" y1="70" x2="58" y2="92" />
      {/* Upper arm fixed */}
      <line x1="50" y1="40" x2="48" y2="60" />
      <line x1="50" y1="40" x2="52" y2="60" />
      {/* Forearms curling */}
      <g style={{ animation: `${id}-curl 2.4s ease-in-out infinite`, transformOrigin: '48px 60px' }}>
        <line x1="48" y1="60" x2="38" y2="78" />
        <circle cx="38" cy="78" r="2.2" fill={ACCENT} />
      </g>
      <g style={{ animation: `${id}-curl 2.4s ease-in-out infinite`, transformOrigin: '52px 60px' }}>
        <line x1="52" y1="60" x2="62" y2="78" />
        <circle cx="62" cy="78" r="2.2" fill={ACCENT} />
      </g>
    </>
  )
}

function Pushdown({ id }) {
  return baseSvg(
    <>
      <Floor />
      <line x1="22" y1="14" x2="22" y2="60" stroke={FLOOR} strokeWidth="1.5" />
      <circle cx="22" cy="20" r="1.6" fill={ACCENT} />
      <circle cx="56" cy="32" r="3.5" fill={STROKE} />
      <line x1="56" y1="35.5" x2="56" y2="74" />
      <line x1="56" y1="74" x2="48" y2="92" />
      <line x1="56" y1="74" x2="64" y2="92" />
      {/* Upper arm fixed */}
      <line x1="56" y1="44" x2="50" y2="58" />
      {/* Forearm extends */}
      <g style={{ animation: `${id}-pushdown 2.4s ease-in-out infinite`, transformOrigin: '50px 58px' }}>
        <line x1="50" y1="58" x2="40" y2="76" />
        <line x1="40" y1="76" x2="22" y2="34" stroke={ACCENT} strokeDasharray="2 1.5" />
      </g>
    </>
  )
}

function TricepsExtension({ id }) {
  return baseSvg(
    <>
      <Floor />
      {/* Lying figure */}
      <rect x="20" y="68" width="60" height="5" rx="1" fill={FLOOR} stroke={FLOOR} />
      <circle cx="76" cy="64" r="3" fill={STROKE} />
      <line x1="73" y1="66" x2="26" y2="68" />
      <line x1="26" y1="68" x2="20" y2="92" />
      <line x1="20" y1="92" x2="26" y2="92" />
      {/* Upper arm vertical */}
      <line x1="60" y1="66" x2="60" y2="46" />
      <line x1="55" y1="66" x2="55" y2="46" />
      {/* Forearm extends */}
      <g style={{ animation: `${id}-tri-ext 2.4s ease-in-out infinite`, transformOrigin: '57px 46px' }}>
        <line x1="60" y1="46" x2="60" y2="28" />
        <line x1="55" y1="46" x2="55" y2="28" />
        <Bar id={id} anim={`${id}-bar-tri`} x="49" y="28" length="18" />
      </g>
    </>
  )
}

function Dip({ id }) {
  return baseSvg(
    <>
      <Floor />
      {/* Parallel bars */}
      <line x1="22" y1="40" x2="38" y2="40" stroke={ACCENT} strokeWidth="2" />
      <line x1="62" y1="40" x2="78" y2="40" stroke={ACCENT} strokeWidth="2" />
      <line x1="30" y1="40" x2="30" y2="92" stroke={FLOOR} />
      <line x1="70" y1="40" x2="70" y2="92" stroke={FLOOR} />
      {/* Body */}
      <g style={{ animation: `${id}-dip 2.6s ease-in-out infinite`, transformOrigin: '50px 50px' }}>
        <circle cx="50" cy="36" r="3.2" fill={STROKE} />
        <line x1="50" y1="39" x2="50" y2="70" />
        <line x1="50" y1="70" x2="44" y2="86" />
        <line x1="50" y1="70" x2="56" y2="86" />
        {/* Arms */}
        <line x1="50" y1="44" x2="34" y2="40" />
        <line x1="50" y1="44" x2="66" y2="40" />
      </g>
    </>
  )
}

function Squat({ id }) {
  return baseSvg(
    <>
      <Floor />
      <g style={{ animation: `${id}-squat 2.6s ease-in-out infinite`, transformOrigin: '50px 70px' }}>
        <circle cx="50" cy="32" r="3.5" fill={STROKE} />
        <line x1="50" y1="35.5" x2="50" y2="60" />
        {/* Bar on shoulders */}
        <Bar id={id} anim="" x="32" y="38" length="36" />
        <line x1="50" y1="60" x2="40" y2="78" />
        <line x1="40" y1="78" x2="42" y2="92" />
        <line x1="50" y1="60" x2="60" y2="78" />
        <line x1="60" y1="78" x2="58" y2="92" />
      </g>
    </>
  )
}

function LegPress({ id }) {
  return baseSvg(
    <>
      <Floor />
      {/* Sled rail */}
      <line x1="20" y1="78" x2="92" y2="34" stroke={FLOOR} strokeWidth="1.4" />
      {/* Seat */}
      <rect x="14" y="68" width="22" height="14" rx="1.2" fill={FLOOR} stroke={FLOOR} />
      {/* Stick figure seated */}
      <circle cx="22" cy="60" r="3" fill={STROKE} />
      <line x1="22" y1="63" x2="22" y2="74" />
      {/* Animated leg */}
      <g style={{ animation: `${id}-legpress 2.6s ease-in-out infinite` }}>
        <line x1="22" y1="74" x2="60" y2="58" />
        <line x1="60" y1="58" x2="74" y2="50" />
        <rect x="68" y="40" width="18" height="18" rx="2" fill="none" stroke={ACCENT} strokeWidth="1.6" />
      </g>
    </>
  )
}

function Lunge({ id }) {
  return baseSvg(
    <>
      <Floor />
      <g style={{ animation: `${id}-lunge 2.8s ease-in-out infinite` }}>
        <circle cx="50" cy="34" r="3.5" fill={STROKE} />
        <line x1="50" y1="37.5" x2="50" y2="64" />
        {/* Front leg */}
        <line x1="50" y1="64" x2="68" y2="78" />
        <line x1="68" y1="78" x2="68" y2="92" />
        {/* Back leg */}
        <line x1="50" y1="64" x2="34" y2="80" />
        <line x1="34" y1="80" x2="38" y2="92" />
        {/* Arms with weights */}
        <line x1="50" y1="44" x2="44" y2="62" />
        <line x1="50" y1="44" x2="56" y2="62" />
        <circle cx="44" cy="64" r="2.2" fill={ACCENT} />
        <circle cx="56" cy="64" r="2.2" fill={ACCENT} />
      </g>
    </>
  )
}

function LegCurl({ id }) {
  return baseSvg(
    <>
      <Floor />
      <rect x="20" y="56" width="58" height="6" rx="1.2" fill={FLOOR} stroke={FLOOR} />
      <circle cx="22" cy="52" r="3" fill={STROKE} />
      <line x1="25" y1="54" x2="68" y2="58" />
      {/* Upper leg fixed */}
      <line x1="68" y1="58" x2="80" y2="62" />
      {/* Lower leg curling */}
      <g style={{ animation: `${id}-legcurl 2.4s ease-in-out infinite`, transformOrigin: '80px 62px' }}>
        <line x1="80" y1="62" x2="86" y2="84" />
        <circle cx="86" cy="84" r="2.2" fill={ACCENT} />
      </g>
    </>
  )
}

function LegExtension({ id }) {
  return baseSvg(
    <>
      <Floor />
      {/* Seat */}
      <rect x="14" y="56" width="30" height="14" rx="1.4" fill={FLOOR} stroke={FLOOR} />
      <circle cx="22" cy="48" r="3" fill={STROKE} />
      <line x1="22" y1="51" x2="22" y2="62" />
      <line x1="22" y1="62" x2="44" y2="68" />
      {/* Lower leg extends */}
      <g style={{ animation: `${id}-legext 2.4s ease-in-out infinite`, transformOrigin: '44px 68px' }}>
        <line x1="44" y1="68" x2="44" y2="92" />
        <circle cx="44" cy="92" r="2" fill={ACCENT} />
      </g>
    </>
  )
}

function Deadlift({ id }) {
  return baseSvg(
    <>
      <Floor />
      <g style={{ animation: `${id}-dead 2.8s ease-in-out infinite` }}>
        <circle cx="50" cy="32" r="3.5" fill={STROKE} />
        <line x1="50" y1="35.5" x2="50" y2="64" />
        {/* Legs */}
        <line x1="50" y1="64" x2="42" y2="86" />
        <line x1="50" y1="64" x2="58" y2="86" />
        {/* Arms holding bar */}
        <line x1="50" y1="44" x2="42" y2="76" />
        <line x1="50" y1="44" x2="58" y2="76" />
        <Bar id={id} anim={`${id}-bar-dead`} x="32" y="76" length="36" />
      </g>
    </>
  )
}

function HipThrust({ id }) {
  return baseSvg(
    <>
      <Floor />
      {/* Bench */}
      <rect x="68" y="58" width="22" height="6" rx="1.2" fill={FLOOR} stroke={FLOOR} />
      <line x1="72" y1="64" x2="72" y2="86" stroke={FLOOR} />
      <line x1="86" y1="64" x2="86" y2="86" stroke={FLOOR} />
      {/* Body hip thrust */}
      <g style={{ animation: `${id}-hipthrust 2.6s ease-in-out infinite`, transformOrigin: '46px 78px' }}>
        <circle cx="78" cy="56" r="3" fill={STROKE} />
        <line x1="76" y1="58" x2="46" y2="62" />
        {/* Bar on hip */}
        <Bar id={id} anim="" x="38" y="62" length="20" />
        <line x1="46" y1="62" x2="32" y2="80" />
        <line x1="32" y1="80" x2="32" y2="92" />
      </g>
    </>
  )
}

function GluteKickback({ id }) {
  return baseSvg(
    <>
      <Floor />
      <line x1="86" y1="14" x2="86" y2="92" stroke={FLOOR} strokeWidth="1.5" />
      <circle cx="86" cy="60" r="1.6" fill={ACCENT} />
      <circle cx="42" cy="38" r="3.5" fill={STROKE} />
      <line x1="42" y1="41.5" x2="42" y2="68" />
      {/* Standing leg */}
      <line x1="42" y1="68" x2="40" y2="92" />
      {/* Kickback leg */}
      <g style={{ animation: `${id}-kick 2.4s ease-in-out infinite`, transformOrigin: '42px 68px' }}>
        <line x1="42" y1="68" x2="68" y2="78" />
        <line x1="68" y1="78" x2="86" y2="76" stroke={ACCENT} strokeDasharray="2 1.5" />
      </g>
    </>
  )
}

function Crunch({ id }) {
  return baseSvg(
    <>
      <Floor />
      {/* Lying with knees bent, torso animates up */}
      <line x1="20" y1="86" x2="60" y2="86" />
      <g style={{ animation: `${id}-crunch 2.4s ease-in-out infinite`, transformOrigin: '40px 86px' }}>
        <circle cx="22" cy="74" r="3.2" fill={STROKE} />
        <line x1="25" y1="76" x2="42" y2="84" />
      </g>
      {/* Knees */}
      <line x1="42" y1="84" x2="60" y2="68" />
      <line x1="60" y1="68" x2="76" y2="86" />
    </>
  )
}

function Plank({ id }) {
  return baseSvg(
    <>
      <Floor />
      <g style={{ animation: `${id}-plank 2.4s ease-in-out infinite` }}>
        <circle cx="22" cy="60" r="3.2" fill={STROKE} />
        <line x1="25" y1="62" x2="78" y2="74" />
        {/* Forearms */}
        <line x1="25" y1="62" x2="22" y2="80" />
        <line x1="22" y1="80" x2="32" y2="80" />
        {/* Legs */}
        <line x1="78" y1="74" x2="86" y2="86" />
      </g>
    </>
  )
}

function Twist({ id }) {
  return baseSvg(
    <>
      <Floor />
      {/* Seated, leaning back */}
      <line x1="42" y1="86" x2="58" y2="86" />
      <line x1="42" y1="86" x2="34" y2="68" />
      <line x1="58" y1="86" x2="66" y2="68" />
      <g style={{ animation: `${id}-twist 2.4s ease-in-out infinite`, transformOrigin: '50px 80px' }}>
        <line x1="50" y1="80" x2="50" y2="46" />
        <circle cx="50" cy="42" r="3.2" fill={STROKE} />
        <line x1="50" y1="56" x2="36" y2="56" />
        <line x1="50" y1="56" x2="64" y2="56" />
        <circle cx="36" cy="56" r="2" fill={ACCENT} />
        <circle cx="64" cy="56" r="2" fill={ACCENT} />
      </g>
    </>
  )
}

function WristCurl({ id }) {
  return baseSvg(
    <>
      <Floor />
      {/* Forearm horizontal */}
      <line x1="20" y1="60" x2="68" y2="60" />
      <circle cx="20" cy="60" r="2" fill={STROKE} />
      <g style={{ animation: `${id}-wrist 2s ease-in-out infinite`, transformOrigin: '68px 60px' }}>
        <line x1="68" y1="60" x2="78" y2="44" />
        <circle cx="78" cy="44" r="2.4" fill={ACCENT} />
      </g>
    </>
  )
}

function CalfRaise({ id }) {
  return baseSvg(
    <>
      <Floor />
      <g style={{ animation: `${id}-calf 2s ease-in-out infinite` }}>
        <circle cx="50" cy="32" r="3.5" fill={STROKE} />
        <line x1="50" y1="35.5" x2="50" y2="70" />
        <line x1="50" y1="70" x2="44" y2="88" />
        <line x1="50" y1="70" x2="56" y2="88" />
        {/* Heels lift */}
        <line x1="42" y1="88" x2="50" y2="88" />
        <line x1="50" y1="88" x2="58" y2="88" />
      </g>
    </>
  )
}

function Generic({ id }) {
  return baseSvg(
    <>
      <Floor />
      <g style={{ animation: `${id}-generic 2.4s ease-in-out infinite` }}>
        <circle cx="50" cy="34" r="3.5" fill={STROKE} />
        <line x1="50" y1="37.5" x2="50" y2="70" />
        <line x1="50" y1="70" x2="42" y2="92" />
        <line x1="50" y1="70" x2="58" y2="92" />
        <line x1="50" y1="46" x2="34" y2="58" />
        <line x1="50" y1="46" x2="66" y2="58" />
      </g>
    </>
  )
}

function getKeyframes(id) {
  return `
    @keyframes ${id}-press { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(0.55) translateY(8px); } }
    @keyframes ${id}-bar { 0%,100% { transform: translateY(0); } 50% { transform: translateY(20px); } }
    @keyframes ${id}-bar-up { 0%,100% { transform: translateY(0); } 50% { transform: translateY(20px); } }
    @keyframes ${id}-bar-incline { 0%,100% { transform: translate(0,0); } 50% { transform: translate(8px, 16px); } }
    @keyframes ${id}-bar-row { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-22px); } }
    @keyframes ${id}-bar-tri { 0%,100% { transform: translateY(0); } 50% { transform: translateY(16px); } }
    @keyframes ${id}-bar-dead { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
    @keyframes ${id}-pull { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px) scale(0.95,0.85); transform-origin: 50px 42px; } }
    @keyframes ${id}-row { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-18px, -4px); } }
    @keyframes ${id}-fly-l { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(28deg); } }
    @keyframes ${id}-fly-r { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-28deg); } }
    @keyframes ${id}-lat-l { 0%,100% { transform: rotate(70deg); } 50% { transform: rotate(0deg); } }
    @keyframes ${id}-lat-r { 0%,100% { transform: rotate(-70deg); } 50% { transform: rotate(0deg); } }
    @keyframes ${id}-front { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-90deg); } }
    @keyframes ${id}-face { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-14px); } }
    @keyframes ${id}-curl { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-130deg); } }
    @keyframes ${id}-pushdown { 0%,100% { transform: rotate(-30deg); } 50% { transform: rotate(0deg); } }
    @keyframes ${id}-tri-ext { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(0.4) translateY(12px); } }
    @keyframes ${id}-dip { 0%,100% { transform: translateY(0); } 50% { transform: translateY(14px); } }
    @keyframes ${id}-squat { 0%,100% { transform: translateY(0) scaleY(1); } 50% { transform: translateY(8px) scaleY(0.85); } }
    @keyframes ${id}-legpress { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-12px,8px); } }
    @keyframes ${id}-lunge { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
    @keyframes ${id}-legcurl { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-95deg); } }
    @keyframes ${id}-legext { 0%,100% { transform: rotate(40deg); } 50% { transform: rotate(0deg); } }
    @keyframes ${id}-dead { 0%,100% { transform: translateY(0) scaleY(0.9); } 50% { transform: translateY(0) scaleY(1); } }
    @keyframes ${id}-hipthrust { 0%,100% { transform: translateY(8px) rotate(-6deg); } 50% { transform: translateY(0) rotate(0deg); } }
    @keyframes ${id}-kick { 0%,100% { transform: rotate(-50deg); } 50% { transform: rotate(20deg); } }
    @keyframes ${id}-crunch { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-32deg); } }
    @keyframes ${id}-plank { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
    @keyframes ${id}-twist { 0%,100% { transform: rotate(-20deg); } 50% { transform: rotate(20deg); } }
    @keyframes ${id}-wrist { 0%,100% { transform: rotate(36deg); } 50% { transform: rotate(-12deg); } }
    @keyframes ${id}-calf { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes ${id}-generic { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
  `
}
