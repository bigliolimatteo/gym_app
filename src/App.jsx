import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { Dumbbell, ClipboardList, Play, History, Home } from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Dashboard from './pages/Dashboard'
import ExerciseLibrary from './pages/ExerciseLibrary'
import ExerciseDetail from './pages/ExerciseDetail'
import WorkoutPlans from './pages/WorkoutPlans'
import ActiveWorkout from './pages/ActiveWorkout'
import WorkoutHistory from './pages/WorkoutHistory'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/esercizi', icon: Dumbbell, label: 'Esercizi' },
  { to: '/schede', icon: ClipboardList, label: 'Schede' },
  { to: '/allenamento', icon: Play, label: 'Allenati' },
  { to: '/storico', icon: History, label: 'Storico' },
]

export default function App() {
  const [plans, setPlans] = useLocalStorage('gym-plans', [])
  const [workoutLogs, setWorkoutLogs] = useLocalStorage('gym-logs', [])

  const addPlan = (plan) => setPlans(prev => [...prev, { ...plan, id: crypto.randomUUID(), createdAt: new Date().toISOString() }])
  const updatePlan = (id, updates) => setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  const deletePlan = (id) => setPlans(prev => prev.filter(p => p.id !== id))
  const logWorkout = (log) => setWorkoutLogs(prev => [...prev, { ...log, id: crypto.randomUUID(), date: new Date().toISOString() }])
  const deleteLog = (id) => setWorkoutLogs(prev => prev.filter(l => l.id !== id))

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pl-64">
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex-col z-50">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
            <Dumbbell className="w-6 h-6" />
            GymTracker
          </h1>
          <p className="text-xs text-gray-400 mt-1">La tua palestra digitale</p>
        </div>
        <div className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex justify-around py-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-400'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard plans={plans} workoutLogs={workoutLogs} />} />
          <Route path="/esercizi" element={<ExerciseLibrary />} />
          <Route path="/esercizi/:id" element={<ExerciseDetail />} />
          <Route path="/schede" element={<WorkoutPlans plans={plans} addPlan={addPlan} updatePlan={updatePlan} deletePlan={deletePlan} />} />
          <Route path="/allenamento" element={<ActiveWorkout plans={plans} logWorkout={logWorkout} />} />
          <Route path="/storico" element={<WorkoutHistory logs={workoutLogs} deleteLog={deleteLog} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
