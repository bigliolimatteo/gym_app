import { useState } from 'react'
import { Plus, Trash2, X, Search, GripVertical } from 'lucide-react'
import { EXERCISES, MUSCLE_GROUPS } from '../data/exercises'

export default function WorkoutPlans({ plans, addPlan, updatePlan, deletePlan }) {
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schede di Allenamento</h1>
          <p className="text-gray-500 text-sm mt-1">Crea e gestisci le tue schede</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setEditingId(null) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuova Scheda
        </button>
      </div>

      {showCreate && (
        <PlanEditor
          plan={editingId ? plans.find(p => p.id === editingId) : null}
          onSave={(plan) => {
            if (editingId) {
              updatePlan(editingId, plan)
            } else {
              addPlan(plan)
            }
            setShowCreate(false)
            setEditingId(null)
          }}
          onCancel={() => { setShowCreate(false); setEditingId(null) }}
        />
      )}

      {plans.length === 0 && !showCreate && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-gray-500 text-lg">Nessuna scheda ancora</p>
          <p className="text-gray-400 text-sm mt-1">Crea la tua prima scheda di allenamento!</p>
        </div>
      )}

      <div className="space-y-4">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                {plan.description && <p className="text-sm text-gray-500 mt-1">{plan.description}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {plan.exercises.length} esercizi · Creata il {new Date(plan.createdAt).toLocaleDateString('it-IT')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingId(plan.id); setShowCreate(true) }}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  ✏️
                </button>
                <button
                  onClick={() => { if (confirm('Eliminare questa scheda?')) deletePlan(plan.id) }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {plan.exercises.map((ex, i) => {
                const exerciseData = EXERCISES.find(e => e.id === ex.exerciseId)
                const group = MUSCLE_GROUPS.find(g => g.id === exerciseData?.muscleGroup)
                return (
                  <div key={i} className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-mono text-gray-400 w-6">{i + 1}.</span>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ${group?.color || 'bg-gray-400'}`}>
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
        ))}
      </div>
    </div>
  )
}

function PlanEditor({ plan, onSave, onCancel }) {
  const [name, setName] = useState(plan?.name || '')
  const [description, setDescription] = useState(plan?.description || '')
  const [exercises, setExercises] = useState(plan?.exercises || [])
  const [showExercisePicker, setShowExercisePicker] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterGroup, setFilterGroup] = useState('')

  const addExercise = (exerciseId) => {
    setExercises(prev => [...prev, { exerciseId, targetSets: 3, targetReps: 10, restSeconds: 90, notes: '' }])
    setShowExercisePicker(false)
    setSearchQuery('')
  }

  const updateExercise = (index, field, value) => {
    setExercises(prev => prev.map((ex, i) => i === index ? { ...ex, [field]: value } : ex))
  }

  const removeExercise = (index) => {
    setExercises(prev => prev.filter((_, i) => i !== index))
  }

  const moveExercise = (index, direction) => {
    const newExercises = [...exercises]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= newExercises.length) return
    ;[newExercises[index], newExercises[targetIndex]] = [newExercises[targetIndex], newExercises[index]]
    setExercises(newExercises)
  }

  const handleSave = () => {
    if (!name.trim() || exercises.length === 0) return
    onSave({ name: name.trim(), description: description.trim(), exercises })
  }

  const filteredExercises = EXERCISES.filter(e => {
    const matchesSearch = !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGroup = !filterGroup || e.muscleGroup === filterGroup
    return matchesSearch && matchesGroup
  })

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">{plan ? 'Modifica Scheda' : 'Nuova Scheda'}</h2>
        <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome della scheda *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Es: Scheda A - Upper Body"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Es: Allenamento per la parte superiore del corpo"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Exercises */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Esercizi *</label>
          <div className="space-y-2">
            {exercises.map((ex, i) => {
              const exerciseData = EXERCISES.find(e => e.id === ex.exerciseId)
              const group = MUSCLE_GROUPS.find(g => g.id === exerciseData?.muscleGroup)
              return (
                <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveExercise(i, -1)} className="text-gray-300 hover:text-gray-500 text-xs">▲</button>
                    <button onClick={() => moveExercise(i, 1)} className="text-gray-300 hover:text-gray-500 text-xs">▼</button>
                  </div>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm shrink-0 ${group?.color || 'bg-gray-400'}`}>
                    {group?.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{exerciseData?.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={ex.targetSets}
                      onChange={e => updateExercise(i, 'targetSets', parseInt(e.target.value) || 0)}
                      className="w-12 text-center text-sm border border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      min="1"
                    />
                    <span className="text-gray-400 text-sm">×</span>
                    <input
                      type="number"
                      value={ex.targetReps}
                      onChange={e => updateExercise(i, 'targetReps', parseInt(e.target.value) || 0)}
                      className="w-12 text-center text-sm border border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      min="1"
                    />
                  </div>
                  <button onClick={() => removeExercise(i)} className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>

          {showExercisePicker ? (
            <div className="mt-3 border border-gray-200 rounded-xl p-3 bg-gray-50">
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cerca esercizio..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                    autoFocus
                  />
                </div>
                <select
                  value={filterGroup}
                  onChange={e => setFilterGroup(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Tutti</option>
                  {MUSCLE_GROUPS.map(g => (
                    <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
                  ))}
                </select>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredExercises.map(ex => {
                  const group = MUSCLE_GROUPS.find(g => g.id === ex.muscleGroup)
                  const alreadyAdded = exercises.some(e => e.exerciseId === ex.id)
                  return (
                    <button
                      key={ex.id}
                      onClick={() => !alreadyAdded && addExercise(ex.id)}
                      disabled={alreadyAdded}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-left text-sm transition-colors ${
                        alreadyAdded ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-md flex items-center justify-center text-white text-xs ${group?.color}`}>
                        {group?.icon}
                      </span>
                      <span className="flex-1 truncate">{ex.name}</span>
                      {alreadyAdded && <span className="text-xs text-gray-400">già aggiunto</span>}
                    </button>
                  )
                })}
              </div>
              <button onClick={() => setShowExercisePicker(false)} className="mt-2 text-sm text-gray-500 hover:text-gray-700">
                Chiudi
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowExercisePicker(true)}
              className="mt-3 flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Aggiungi esercizio
            </button>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={!name.trim() || exercises.length === 0}
            className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {plan ? 'Salva Modifiche' : 'Crea Scheda'}
          </button>
          <button onClick={onCancel} className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            Annulla
          </button>
        </div>
      </div>
    </div>
  )
}
