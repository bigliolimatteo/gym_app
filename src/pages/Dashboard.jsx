import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell, ClipboardList, Play, History, TrendingUp, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { fetchUserAssignedPlan } from '../lib/planUtils'

function mapRowsToLogs(rows) {
  return (rows || []).map((log) => {
    const sets = log.workout_log_sets || []
    const byExercise = {}
    for (const s of sets) {
      if (!byExercise[s.exercise_id]) byExercise[s.exercise_id] = []
      byExercise[s.exercise_id].push({ weight: Number(s.weight) || 0, reps: Number(s.reps) || 0 })
    }
    const exercises = Object.entries(byExercise).map(([exerciseId, arr]) => ({
      exerciseId,
      sets: arr,
    }))
    return {
      id: log.id,
      date: log.date,
      planName: log.plan_name || 'Allenamento',
      exercises,
    }
  })
}

export default function Dashboard() {
  const { user } = useAuth()
  const [workoutLogs, setWorkoutLogs] = useState([])
  const [planPreview, setPlanPreview] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    const { data: logsData } = await supabase
      .from('workout_logs')
      .select(
        `
        id,
        plan_name,
        date,
        workout_log_sets ( exercise_id, weight, reps )
      `,
      )
      .eq('user_id', user.id)
      .order('date', { ascending: true })

    setWorkoutLogs(mapRowsToLogs(logsData))

    try {
      const p = await fetchUserAssignedPlan(supabase, user.id)
      setPlanPreview(p)
    } catch {
      setPlanPreview(null)
    }
    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return <p className="text-gray-500">Caricamento…</p>
  }

  const totalWorkouts = workoutLogs.length
  const totalSets = workoutLogs.reduce((acc, log) => acc + log.exercises.reduce((a, e) => a + e.sets.length, 0), 0)
  const totalVolume = workoutLogs.reduce(
    (acc, log) =>
      acc +
      log.exercises.reduce((a, e) => a + e.sets.reduce((s, set) => s + (set.weight || 0) * (set.reps || 0), 0), 0),
    0,
  )

  const lastWorkout =
    workoutLogs.length > 0
      ? new Date(workoutLogs[workoutLogs.length - 1].date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })
      : 'Mai'

  const quickActions = [
    { to: '/esercizi', icon: Dumbbell, label: 'Esercizi', desc: 'Esplora gli esercizi', color: 'bg-blue-500' },
    { to: '/schede', icon: ClipboardList, label: 'La mia scheda', desc: 'Vedi la scheda del trainer', color: 'bg-green-500' },
    { to: '/allenamento', icon: Play, label: 'Allenati', desc: 'Inizia un allenamento', color: 'bg-orange-500' },
    { to: '/storico', icon: History, label: 'Storico', desc: 'Vedi i progressi', color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">GymTracker 🏋️</h1>
        <p className="text-gray-500 mt-1">La tua palestra digitale</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Allenamenti', value: totalWorkouts, Glyph: Calendar, color: 'text-blue-600 bg-blue-50' },
          { label: 'Serie totali', value: totalSets, Glyph: TrendingUp, color: 'text-green-600 bg-green-50' },
          { label: 'Volume (kg)', value: totalVolume.toLocaleString('it'), Glyph: Dumbbell, color: 'text-orange-600 bg-orange-50' },
          { label: 'Ultimo', value: lastWorkout, Glyph: History, color: 'text-purple-600 bg-purple-50' },
        ].map((row) => {
          const G = row.Glyph
          return (
            <div key={row.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${row.color}`}>
                <G className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{row.value}</p>
              <p className="text-xs text-gray-500 mt-1">{row.label}</p>
            </div>
          )
        })}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Azioni rapide</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const G = action.icon
            return (
              <Link
                key={action.to}
                to={action.to}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${action.color} text-white group-hover:scale-110 transition-transform`}
                >
                  <G className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">{action.label}</h3>
                <p className="text-sm text-gray-500">{action.desc}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {planPreview && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">La tua scheda</h2>
          <Link
            to="/schede"
            className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{planPreview.name}</h3>
                <p className="text-sm text-gray-500">{planPreview.exercises.length} esercizi</p>
              </div>
              <Play className="w-5 h-5 text-primary-500" />
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
