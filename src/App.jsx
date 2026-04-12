import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { Dumbbell, ClipboardList, Play, History, Home, Users, LogOut } from 'lucide-react'
import { useAuth } from './hooks/useAuth'
import Dashboard from './pages/Dashboard'
import ExerciseLibrary from './pages/ExerciseLibrary'
import ExerciseDetail from './pages/ExerciseDetail'
import WorkoutPlans from './pages/WorkoutPlans'
import ActiveWorkout from './pages/ActiveWorkout'
import WorkoutHistory from './pages/WorkoutHistory'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import TrainerDashboard from './pages/trainer/TrainerDashboard'
import ClientDetail from './pages/trainer/ClientDetail'

const USER_NAV = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/esercizi', icon: Dumbbell, label: 'Esercizi', end: false },
  { to: '/schede', icon: ClipboardList, label: 'Scheda', end: false },
  { to: '/allenamento', icon: Play, label: 'Allenati', end: false },
  { to: '/storico', icon: History, label: 'Storico', end: false },
]

const TRAINER_NAV = [
  { to: '/trainer', icon: Users, label: 'Clienti', end: true },
  { to: '/esercizi', icon: Dumbbell, label: 'Esercizi', end: false },
]

function Shell({ children, navItems, subtitle }) {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pl-64">
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex-col z-50">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
            <Dumbbell className="w-6 h-6" />
            GymTracker
          </h1>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          <button
            type="button"
            onClick={() => signOut()}
            className="mt-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
          >
            <LogOut className="w-4 h-4" />
            Esci
          </button>
        </div>
        <div className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const NavIcon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`
                }
              >
                <NavIcon className="w-5 h-5" />
                {item.label}
              </NavLink>
            )
          })}
        </div>
      </nav>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const NavIcon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-2 py-1 text-xs font-medium transition-colors max-w-[4.5rem] text-center ${
                    isActive ? 'text-primary-600' : 'text-gray-400'
                  }`
                }
              >
                <NavIcon className="w-5 h-5" />
                {item.label}
              </NavLink>
            )
          })}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}

export default function App() {
  const { session, profile, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Caricamento…
      </div>
    )
  }

  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 p-4">
        <p className="text-gray-600 text-center">Profilo non disponibile. Prova ad accedere di nuovo.</p>
        <button
          type="button"
          onClick={() => signOut()}
          className="px-4 py-2 bg-primary-600 text-white rounded-xl"
        >
          Esci
        </button>
      </div>
    )
  }

  if (profile.role === 'trainer') {
    return (
      <Shell navItems={TRAINER_NAV} subtitle="Area personal trainer">
        <Routes>
          <Route path="/trainer" element={<TrainerDashboard />} />
          <Route path="/trainer/client/:clientId" element={<ClientDetail />} />
          <Route path="/esercizi" element={<ExerciseLibrary />} />
          <Route path="/esercizi/:id" element={<ExerciseDetail />} />
          <Route path="/login" element={<Navigate to="/trainer" replace />} />
          <Route path="/register" element={<Navigate to="/trainer" replace />} />
          <Route path="/" element={<Navigate to="/trainer" replace />} />
          <Route path="*" element={<Navigate to="/trainer" replace />} />
        </Routes>
      </Shell>
    )
  }

  return (
    <Shell navItems={USER_NAV} subtitle="La tua palestra digitale">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/esercizi" element={<ExerciseLibrary />} />
        <Route path="/esercizi/:id" element={<ExerciseDetail />} />
        <Route path="/schede" element={<WorkoutPlans />} />
        <Route path="/allenamento" element={<ActiveWorkout />} />
        <Route path="/storico" element={<WorkoutHistory />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="/trainer" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  )
}
