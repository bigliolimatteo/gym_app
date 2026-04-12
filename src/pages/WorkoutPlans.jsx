import { useCallback, useEffect, useState } from 'react'
import { EXERCISES, MUSCLE_GROUPS } from '../data/exercises'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { fetchUserAssignedPlan } from '../lib/planUtils'

export default function WorkoutPlans() {
  const { user } = useAuth()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const p = await fetchUserAssignedPlan(supabase, user.id)
      setPlan(p)
    } catch (e) {
      console.error(e)
      setPlan(null)
    }
    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return <p className="text-gray-500">Caricamento…</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">La mia scheda</h1>
        <p className="text-gray-500 text-sm mt-1">Scheda personalizzata dal tuo personal trainer (sola lettura)</p>
      </div>

      {!plan ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-gray-500 text-lg">Nessuna scheda assegnata</p>
          <p className="text-gray-400 text-sm mt-1">Chiedi al tuo trainer di creare una scheda per te.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="mb-3">
            <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
            {plan.description && <p className="text-sm text-gray-500 mt-1">{plan.description}</p>}
            <p className="text-xs text-gray-400 mt-1">
              {plan.exercises.length} esercizi · Aggiornata il {new Date(plan.createdAt).toLocaleDateString('it-IT')}
            </p>
          </div>
          <div className="space-y-2">
            {plan.exercises.map((ex, i) => {
              const exerciseData = EXERCISES.find((e) => e.id === ex.exerciseId)
              const group = MUSCLE_GROUPS.find((g) => g.id === exerciseData?.muscleGroup)
              return (
                <div key={i} className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-mono text-gray-400 w-6">{i + 1}.</span>
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ${group?.color || 'bg-gray-400'}`}
                  >
                    {group?.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{exerciseData?.name || ex.exerciseId}</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-lg">
                    {ex.targetSets}×{ex.targetReps}
                  </span>
                  {ex.notes && <span className="text-xs text-gray-400 hidden md:inline">📝 {ex.notes}</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
