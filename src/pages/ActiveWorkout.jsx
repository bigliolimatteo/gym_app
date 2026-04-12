import { useState } from 'react'
import { Play, CheckCircle, Plus, Trash2, Timer, Award } from 'lucide-react'
import { EXERCISES, MUSCLE_GROUPS } from '../data/exercises'

export default function ActiveWorkout({ plans, logWorkout }) {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [workoutInProgress, setWorkoutInProgress] = useState(null)
  const [completedWorkout, setCompletedWorkout] = useState(null)

  const startWorkout = (plan) => {
    setSelectedPlan(plan)
    setWorkoutInProgress({
      planId: plan.id,
      planName: plan.name,
      exercises: plan.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        sets: Array.from({ length: ex.targetSets }, () => ({ weight: '', reps: '', completed: false })),
      })),
      startTime: new Date().toISOString(),
    })
  }

  const updateSet = (exerciseIdx, setIdx, field, value) => {
    setWorkoutInProgress(prev => {
      const updated = { ...prev }
      updated.exercises = prev.exercises.map((ex, ei) =>
        ei === exerciseIdx
          ? {
              ...ex,
              sets: ex.sets.map((s, si) =>
                si === setIdx ? { ...s, [field]: field === 'completed' ? value : value } : s
              ),
            }
          : ex
      )
      return updated
    })
  }

  const addSet = (exerciseIdx) => {
    setWorkoutInProgress(prev => {
      const updated = { ...prev }
      updated.exercises = prev.exercises.map((ex, ei) =>
        ei === exerciseIdx
          ? { ...ex, sets: [...ex.sets, { weight: '', reps: '', completed: false }] }
          : ex
      )
      return updated
    })
  }

  const removeSet = (exerciseIdx, setIdx) => {
    setWorkoutInProgress(prev => {
      const updated = { ...prev }
      updated.exercises = prev.exercises.map((ex, ei) =>
        ei === exerciseIdx
          ? { ...ex, sets: ex.sets.filter((_, si) => si !== setIdx) }
          : ex
      )
      return updated
    })
  }

  const finishWorkout = () => {
    const log = {
      ...workoutInProgress,
      endTime: new Date().toISOString(),
      exercises: workoutInProgress.exercises.map(ex => ({
        ...ex,
        sets: ex.sets
          .filter(s => s.completed)
          .map(s => ({
            weight: parseFloat(s.weight) || 0,
            reps: parseInt(s.reps) || 0,
          })),
      })).filter(ex => ex.sets.length > 0),
    }

    logWorkout(log)
    setCompletedWorkout(log)
    setWorkoutInProgress(null)
    setSelectedPlan(null)
  }

  // Completed screen
  if (completedWorkout) {
    const totalSets = completedWorkout.exercises.reduce((a, e) => a + e.sets.length, 0)
    const totalVolume = completedWorkout.exercises.reduce((a, e) =>
      a + e.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0)

    return (
      <div className="text-center py-12 space-y-6">
        <div className="text-6xl">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900">Ottimo lavoro!</h1>
        <p className="text-gray-500">Allenamento completato</p>
        <div className="flex justify-center gap-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-primary-600">{totalSets}</p>
            <p className="text-xs text-gray-500">Serie</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-green-600">{totalVolume.toLocaleString('it')} kg</p>
            <p className="text-xs text-gray-500">Volume totale</p>
          </div>
        </div>
        <button
          onClick={() => setCompletedWorkout(null)}
          className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          Torna alla selezione
        </button>
      </div>
    )
  }

  // Active workout
  if (workoutInProgress) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🏋️ In Allenamento</h1>
            <p className="text-gray-500 text-sm">{workoutInProgress.planName}</p>
          </div>
          <button
            onClick={finishWorkout}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Fine
          </button>
        </div>

        {workoutInProgress.exercises.map((ex, exIdx) => {
          const exerciseData = EXERCISES.find(e => e.id === ex.exerciseId)
          const group = MUSCLE_GROUPS.find(g => g.id === exerciseData?.muscleGroup)
          const completedSets = ex.sets.filter(s => s.completed).length

          return (
            <div key={exIdx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${group?.color || 'bg-gray-400'}`}>
                  {group?.icon}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{exerciseData?.name}</h3>
                  <p className="text-xs text-gray-500">
                    Obiettivo: {ex.targetSets}×{ex.targetReps} · Completate: {completedSets}/{ex.sets.length}
                  </p>
                </div>
              </div>

              {/* Sets table */}
              <div className="space-y-2">
                <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem_2.5rem] gap-2 text-xs font-medium text-gray-400 px-1">
                  <span>#</span>
                  <span>Peso (kg)</span>
                  <span>Reps</span>
                  <span>✓</span>
                  <span></span>
                </div>
                {ex.sets.map((set, setIdx) => (
                  <div
                    key={setIdx}
                    className={`grid grid-cols-[2rem_1fr_1fr_2.5rem_2.5rem] gap-2 items-center px-1 py-1.5 rounded-lg transition-colors ${
                      set.completed ? 'bg-green-50' : ''
                    }`}
                  >
                    <span className="text-sm font-mono text-gray-400">{setIdx + 1}</span>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={e => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                      placeholder="0"
                      className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      step="0.5"
                    />
                    <input
                      type="number"
                      value={set.reps}
                      onChange={e => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                      placeholder="0"
                      className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      min="0"
                    />
                    <button
                      onClick={() => updateSet(exIdx, setIdx, 'completed', !set.completed)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        set.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeSet(exIdx, setIdx)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addSet(exIdx)}
                className="mt-3 flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Aggiungi serie
              </button>
            </div>
          )
        })}
      </div>
    )
  }

  // Plan selection
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inizia Allenamento</h1>
        <p className="text-gray-500 text-sm mt-1">Scegli una scheda per iniziare</p>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-gray-500 text-lg">Nessuna scheda disponibile</p>
          <p className="text-gray-400 text-sm mt-1">Vai alla sezione "Schede" per creare la tua prima scheda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map(plan => (
            <button
              key={plan.id}
              onClick={() => startWorkout(plan)}
              className="w-full text-left bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                  {plan.description && <p className="text-sm text-gray-500 mt-1">{plan.description}</p>}
                  <p className="text-xs text-gray-400 mt-2">{plan.exercises.length} esercizi</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <Play className="w-7 h-7 text-primary-600" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
