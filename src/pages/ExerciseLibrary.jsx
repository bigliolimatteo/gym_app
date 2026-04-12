import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronRight, Filter } from 'lucide-react'
import { MUSCLE_GROUPS, EXERCISES, getExercisesByMuscleGroup } from '../data/exercises'

export default function ExerciseLibrary() {
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterEquipment, setFilterEquipment] = useState('')

  const filteredExercises = selectedGroup
    ? getExercisesByMuscleGroup(selectedGroup)
    : EXERCISES

  const searchFiltered = filteredExercises.filter(e => {
    const matchesSearch = !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEquipment = !filterEquipment || e.equipment === filterEquipment
    return matchesSearch && matchesEquipment
  })

  const allEquipment = [...new Set(EXERCISES.map(e => e.equipment))]

  const difficultyBadge = (d) => {
    const colors = {
      principiante: 'bg-green-100 text-green-700',
      intermedio: 'bg-amber-100 text-amber-700',
      avanzato: 'bg-red-100 text-red-700',
    }
    return colors[d] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Esercizi</h1>
        <p className="text-gray-500 text-sm mt-1">Esplora {EXERCISES.length} esercizi per gruppo muscolare</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cerca un esercizio..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Muscle group pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedGroup(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !selectedGroup ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Tutti
        </button>
        {MUSCLE_GROUPS.map(group => (
          <button
            key={group.id}
            onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedGroup === group.id ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {group.icon} {group.name}
          </button>
        ))}
      </div>

      {/* Equipment filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={filterEquipment}
          onChange={e => setFilterEquipment(e.target.value)}
          className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Tutti gli attrezzi</option>
          {allEquipment.map(eq => (
            <option key={eq} value={eq}>{eq}</option>
          ))}
        </select>
      </div>

      {/* Exercise list */}
      <div className="space-y-3">
        {searchFiltered.map(exercise => {
          const group = MUSCLE_GROUPS.find(g => g.id === exercise.muscleGroup)
          return (
            <Link
              key={exercise.id}
              to={`/esercizi/${exercise.id}`}
              className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg ${group?.color || 'bg-gray-500'}`}>
                  {group?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{exercise.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{group?.name}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">{exercise.equipment}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyBadge(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
              </div>
            </Link>
          )
        })}
        {searchFiltered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Nessun esercizio trovato</p>
            <p className="text-sm mt-1">Prova a cambiare i filtri</p>
          </div>
        )}
      </div>
    </div>
  )
}
