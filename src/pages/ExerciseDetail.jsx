import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Target, Wrench, BarChart3, CheckCircle2, Lightbulb } from 'lucide-react'
import { getExerciseById, getMuscleGroupById } from '../data/exercises'

export default function ExerciseDetail() {
  const { id } = useParams()
  const exercise = getExerciseById(id)

  if (!exercise) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Esercizio non trovato</p>
        <Link to="/esercizi" className="text-primary-600 mt-2 inline-block">Torna alla lista</Link>
      </div>
    )
  }

  const group = getMuscleGroupById(exercise.muscleGroup)
  const secondaryGroups = exercise.secondaryMuscles.map(getMuscleGroupById).filter(Boolean)

  const difficultyStars = { principiante: 1, intermedio: 2, avanzato: 3 }

  return (
    <div className="space-y-6">
      <Link to="/esercizi" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Torna agli esercizi
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shrink-0 ${group?.color || 'bg-gray-500'}`}>
            {group?.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{exercise.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                <Target className="w-3.5 h-3.5" />
                {group?.name}
              </span>
              <span className="inline-flex items-center gap-1 text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                <Wrench className="w-3.5 h-3.5" />
                {exercise.equipment}
              </span>
              <span className="inline-flex items-center gap-1 text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                <BarChart3 className="w-3.5 h-3.5" />
                {'⭐'.repeat(difficultyStars[exercise.difficulty] || 1)} {exercise.difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary muscles */}
      {secondaryGroups.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3">Muscoli secondari</h2>
          <div className="flex flex-wrap gap-2">
            {secondaryGroups.map(sg => (
              <span key={sg.id} className={`inline-flex items-center gap-1 text-sm text-white px-3 py-1 rounded-full ${sg.color}`}>
                {sg.icon} {sg.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-3">Descrizione</h2>
        <p className="text-gray-600 leading-relaxed">{exercise.description}</p>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          Come eseguire l'esercizio
        </h2>
        <ol className="space-y-3">
          {exercise.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </span>
              <p className="text-gray-600 pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Tips */}
      {exercise.tips.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
          <h2 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Consigli
          </h2>
          <ul className="space-y-2">
            {exercise.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-amber-700">
                <span className="shrink-0">💡</span>
                <p>{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Video link */}
      {exercise.videoUrl && (
        <a
          href={exercise.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-colors shadow-sm"
        >
          <ExternalLink className="w-5 h-5" />
          Cerca video tutorial su YouTube
        </a>
      )}
    </div>
  )
}
