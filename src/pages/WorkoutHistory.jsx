import React, { useState } from 'react'
import { Trash2, ChevronDown, ChevronUp, TrendingUp, Calendar, Dumbbell } from 'lucide-react'
import { EXERCISES, MUSCLE_GROUPS } from '../data/exercises'

export default function WorkoutHistory({ logs, deleteLog }) {
  const [expandedId, setExpandedId] = useState(null)
  const [view, setView] = useState('list') // 'list' | 'progress'
  const [progressExercise, setProgressExercise] = useState('')

  const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date))

  const allLoggedExerciseIds = [...new Set(logs.flatMap(l => l.exercises.map(e => e.exerciseId)))]

  const getProgressData = (exerciseId) => {
    return sortedLogs
      .filter(log => log.exercises.some(e => e.exerciseId === exerciseId))
      .reverse()
      .map(log => {
        const ex = log.exercises.find(e => e.exerciseId === exerciseId)
        const maxWeight = Math.max(...ex.sets.map(s => s.weight))
        const totalVolume = ex.sets.reduce((a, s) => a + s.weight * s.reps, 0)
        const maxReps = Math.max(...ex.sets.map(s => s.reps))
        return {
          date: new Date(log.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
          fullDate: new Date(log.date).toLocaleDateString('it-IT'),
          maxWeight,
          totalVolume,
          maxReps,
          sets: ex.sets,
        }
      })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Storico Allenamenti</h1>
          <p className="text-gray-500 text-sm mt-1">{logs.length} allenamenti registrati</p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-1" />
            Lista
          </button>
          <button
            onClick={() => setView('progress')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === 'progress' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Progressi
          </button>
        </div>
      </div>

      {view === 'progress' ? (
        <div className="space-y-4">
          <select
            value={progressExercise}
            onChange={e => setProgressExercise(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Seleziona un esercizio</option>
            {allLoggedExerciseIds.map(id => {
              const ex = EXERCISES.find(e => e.id === id)
              return <option key={id} value={id}>{ex?.name || id}</option>
            })}
          </select>

          {progressExercise && (
            <ProgressChart exerciseId={progressExercise} data={getProgressData(progressExercise)} />
          )}
        </div>
      ) : (
        <>
          {sortedLogs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-5xl mb-4">📊</p>
              <p className="text-gray-500 text-lg">Nessun allenamento registrato</p>
              <p className="text-gray-400 text-sm mt-1">Completa il tuo primo allenamento!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedLogs.map(log => {
                const isExpanded = expandedId === log.id
                const totalSets = log.exercises.reduce((a, e) => a + e.sets.length, 0)
                const totalVolume = log.exercises.reduce((a, e) =>
                  a + e.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0)

                return (
                  <div key={log.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                      className="w-full p-4 flex items-center gap-4 text-left"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary-50 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-primary-700">
                          {new Date(log.date).getDate()}
                        </span>
                        <span className="text-[10px] text-primary-500 uppercase">
                          {new Date(log.date).toLocaleDateString('it-IT', { month: 'short' })}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{log.planName}</h3>
                        <p className="text-xs text-gray-500">
                          {log.exercises.length} esercizi · {totalSets} serie · {totalVolume.toLocaleString('it')} kg
                        </p>
                      </div>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                        {log.exercises.map((ex, i) => {
                          const exerciseData = EXERCISES.find(e => e.id === ex.exerciseId)
                          const group = MUSCLE_GROUPS.find(g => g.id === exerciseData?.muscleGroup)
                          return (
                            <div key={i} className="bg-gray-50 rounded-xl p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-white text-xs ${group?.color || 'bg-gray-400'}`}>
                                  {group?.icon}
                                </span>
                                <span className="font-medium text-sm text-gray-800">{exerciseData?.name || ex.exerciseId}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1 text-xs">
                                <span className="font-medium text-gray-400">Serie</span>
                                <span className="font-medium text-gray-400">Peso</span>
                                <span className="font-medium text-gray-400">Reps</span>
                                {ex.sets.map((set, si) => (
                                  <React.Fragment key={si}>
                                    <span className="text-gray-600">{si + 1}</span>
                                    <span className="text-gray-800 font-medium">{set.weight} kg</span>
                                    <span className="text-gray-800 font-medium">{set.reps}</span>
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                        <button
                          onClick={() => { if (confirm('Eliminare questo allenamento dallo storico?')) deleteLog(log.id) }}
                          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium mt-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Elimina
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ProgressChart({ exerciseId, data }) {
  const exercise = EXERCISES.find(e => e.id === exerciseId)

  if (data.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-2xl border border-gray-100">
        <p className="text-gray-500">Nessun dato per questo esercizio</p>
      </div>
    )
  }

  const maxWeight = Math.max(...data.map(d => d.maxWeight))
  const maxVolume = Math.max(...data.map(d => d.totalVolume))

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-6">
      <h3 className="font-bold text-gray-900">{exercise?.name} — Progressi</h3>

      {/* Weight progression bar chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
          <Dumbbell className="w-4 h-4" />
          Peso massimo per sessione
        </h4>
        <div className="space-y-2">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-16 shrink-0">{d.date}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full flex items-center justify-end pr-2 transition-all"
                  style={{ width: `${maxWeight > 0 ? (d.maxWeight / maxWeight) * 100 : 0}%`, minWidth: '2rem' }}
                >
                  <span className="text-xs font-bold text-white">{d.maxWeight} kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Volume progression */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Volume totale per sessione
        </h4>
        <div className="space-y-2">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-16 shrink-0">{d.date}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full flex items-center justify-end pr-2 transition-all"
                  style={{ width: `${maxVolume > 0 ? (d.totalVolume / maxVolume) * 100 : 0}%`, minWidth: '2rem' }}
                >
                  <span className="text-xs font-bold text-white">{d.totalVolume.toLocaleString('it')} kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed table */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-3">Dettaglio sessioni</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-2 font-medium">Data</th>
                <th className="pb-2 font-medium">Peso max</th>
                <th className="pb-2 font-medium">Reps max</th>
                <th className="pb-2 font-medium">Volume</th>
                <th className="pb-2 font-medium">Serie</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="border-t border-gray-50">
                  <td className="py-2 text-gray-600">{d.fullDate}</td>
                  <td className="py-2 font-medium">{d.maxWeight} kg</td>
                  <td className="py-2">{d.maxReps}</td>
                  <td className="py-2">{d.totalVolume.toLocaleString('it')} kg</td>
                  <td className="py-2">{d.sets.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
