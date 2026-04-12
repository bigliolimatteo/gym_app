import { Link } from 'react-router-dom'
import { Dumbbell, ClipboardList, Play, History, TrendingUp, Calendar } from 'lucide-react'

export default function Dashboard({ plans, workoutLogs }) {
  const totalWorkouts = workoutLogs.length
  const totalSets = workoutLogs.reduce((acc, log) => acc + log.exercises.reduce((a, e) => a + e.sets.length, 0), 0)
  const totalVolume = workoutLogs.reduce((acc, log) =>
    acc + log.exercises.reduce((a, e) =>
      a + e.sets.reduce((s, set) => s + (set.weight || 0) * (set.reps || 0), 0), 0), 0)

  const lastWorkout = workoutLogs.length > 0
    ? new Date(workoutLogs[workoutLogs.length - 1].date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })
    : 'Mai'

  const quickActions = [
    { to: '/esercizi', icon: Dumbbell, label: 'Esercizi', desc: 'Esplora gli esercizi', color: 'bg-blue-500' },
    { to: '/schede', icon: ClipboardList, label: 'Schede', desc: 'Crea una scheda', color: 'bg-green-500' },
    { to: '/allenamento', icon: Play, label: 'Allenati', desc: 'Inizia un allenamento', color: 'bg-orange-500' },
    { to: '/storico', icon: History, label: 'Storico', desc: 'Vedi i progressi', color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">GymTracker 🏋️</h1>
        <p className="text-gray-500 mt-1">La tua palestra digitale</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Allenamenti', value: totalWorkouts, icon: Calendar, color: 'text-blue-600 bg-blue-50' },
          { label: 'Serie totali', value: totalSets, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
          { label: 'Volume (kg)', value: totalVolume.toLocaleString('it'), icon: Dumbbell, color: 'text-orange-600 bg-orange-50' },
          { label: 'Ultimo', value: lastWorkout, icon: History, color: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Azioni rapide</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map(({ to, icon: Icon, label, desc, color }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${color} text-white group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900">{label}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Schede esistenti */}
      {plans.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Le tue schede</h2>
          <div className="space-y-3">
            {plans.slice(-3).reverse().map(plan => (
              <Link
                key={plan.id}
                to="/allenamento"
                className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.exercises.length} esercizi</p>
                  </div>
                  <Play className="w-5 h-5 text-primary-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
