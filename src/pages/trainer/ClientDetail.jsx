import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, History } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import PlanEditor from '../../components/PlanEditor'
import PremiumTeaser from '../../components/PremiumTeaser'
import { MAX_TRAINING_PLANS_PER_TRAINER_CLIENT } from '../../lib/constants'
import { fetchPlanWithExercises, fetchTrainerClientPlanSummaries } from '../../lib/planUtils'
import WorkoutHistory from '../WorkoutHistory'

export default function ClientDetail() {
  const { clientId } = useParams()
  const { user } = useAuth()
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [allowed, setAllowed] = useState(false)
  const [planSummaries, setPlanSummaries] = useState([])
  const [selectedPlanId, setSelectedPlanId] = useState(null)
  const [plan, setPlan] = useState(null)
  const [creatingNew, setCreatingNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const refreshSummaries = useCallback(async () => {
    if (!user?.id || !clientId) return []
    const list = await fetchTrainerClientPlanSummaries(supabase, clientId, user.id)
    setPlanSummaries(list)
    return list
  }, [user?.id, clientId])

  const load = useCallback(async () => {
    if (!user?.id || !clientId) return
    setLoading(true)
    setError('')

    const { data: rel, error: relErr } = await supabase
      .from('trainer_clients')
      .select('id')
      .eq('trainer_id', user.id)
      .eq('client_id', clientId)
      .maybeSingle()

    if (relErr || !rel) {
      setAllowed(false)
      setLoading(false)
      return
    }
    setAllowed(true)

    const { data: prof } = await supabase.from('profiles').select('full_name, email').eq('id', clientId).single()
    if (prof) {
      setClientName(prof.full_name || '')
      setClientEmail(prof.email || '')
    }

    try {
      await refreshSummaries()
    } catch (e) {
      console.error(e)
      setPlanSummaries([])
    }
    setLoading(false)
  }, [user?.id, clientId, refreshSummaries])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!selectedPlanId || creatingNew) {
      if (creatingNew) setPlan(null)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const p = await fetchPlanWithExercises(supabase, selectedPlanId)
        if (!cancelled) setPlan(p)
      } catch (e) {
        console.error(e)
        if (!cancelled) setPlan(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [selectedPlanId, creatingNew])

  useEffect(() => {
    if (planSummaries.length === 0) {
      setSelectedPlanId(null)
      return
    }
    setSelectedPlanId((prev) => {
      if (prev && planSummaries.some((s) => s.id === prev)) return prev
      return planSummaries[0].id
    })
  }, [planSummaries])

  const planCount = planSummaries.length
  const atPlanLimit = planCount >= MAX_TRAINING_PLANS_PER_TRAINER_CLIENT

  const savePlan = async ({ name, description, exercises }) => {
    if (!user?.id || !clientId) return
    setSaving(true)
    setError('')
    try {
      const isNew = creatingNew || !plan?.id
      if (isNew && atPlanLimit) {
        setError('Hai raggiunto il numero massimo di schede per questo cliente.')
        setSaving(false)
        return
      }

      let planId = plan?.id
      if (planId) {
        const { error: uErr } = await supabase
          .from('workout_plans')
          .update({
            name,
            description: description || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', planId)
          .eq('trainer_id', user.id)
        if (uErr) throw uErr
      } else {
        const { data: inserted, error: iErr } = await supabase
          .from('workout_plans')
          .insert({
            name,
            description: description || null,
            trainer_id: user.id,
            client_id: clientId,
          })
          .select('id')
          .single()
        if (iErr) throw iErr
        planId = inserted.id
      }

      await supabase.from('plan_exercises').delete().eq('plan_id', planId)

      const rows = exercises.map((ex, index) => ({
        plan_id: planId,
        exercise_id: ex.exerciseId,
        target_sets: ex.targetSets,
        target_reps: String(ex.targetReps),
        rest_seconds: ex.restSeconds ?? 90,
        notes: ex.notes || null,
        position: index,
      }))

      const { error: insErr } = await supabase.from('plan_exercises').insert(rows)
      if (insErr) throw insErr

      await refreshSummaries()
      setCreatingNew(false)
      setSelectedPlanId(planId)
      setEditing(false)
      try {
        const p = await fetchPlanWithExercises(supabase, planId)
        setPlan(p)
      } catch (e) {
        console.error(e)
      }
    } catch (e) {
      setError(e.message || 'Salvataggio non riuscito')
    } finally {
      setSaving(false)
    }
  }

  const startNewPlan = () => {
    if (atPlanLimit) return
    setError('')
    setCreatingNew(true)
    setEditing(true)
    setPlan(null)
  }

  const selectPlan = (id) => {
    setCreatingNew(false)
    setEditing(false)
    setError('')
    setSelectedPlanId(id)
  }

  if (loading) {
    return <p className="text-gray-500">Caricamento…</p>
  }

  if (!allowed) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Cliente non trovato o non collegato al tuo account.</p>
        <Link to="/trainer" className="text-primary-600 font-medium mt-4 inline-block">
          Torna ai clienti
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <Link to="/trainer" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Clienti
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{clientName || 'Cliente'}</h1>
        <p className="text-gray-500 text-sm">{clientEmail}</p>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-800">Schede personalizzate</h2>
          <p className="text-sm text-gray-500">
            {planCount}/{MAX_TRAINING_PLANS_PER_TRAINER_CLIENT} schede
          </p>
        </div>

        {!editing && planSummaries.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {planSummaries.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => selectPlan(s.id)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  selectedPlanId === s.id && !creatingNew
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}

        {!editing && atPlanLimit && (
          <PremiumTeaser
            title="Limite schede raggiunto"
            description={`Con l'account gratuito puoi creare fino a ${MAX_TRAINING_PLANS_PER_TRAINER_CLIENT} schede per questo cliente. Per aggiungerne altre sarà necessaria la modalità Premium.`}
          />
        )}

        {!editing && !atPlanLimit && (
          <button
            type="button"
            onClick={startNewPlan}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            + Nuova scheda
          </button>
        )}

        {editing ? (
          <PlanEditor
            key={creatingNew ? 'new' : selectedPlanId || 'edit'}
            plan={creatingNew ? null : plan}
            onSave={savePlan}
            onCancel={() => {
              setEditing(false)
              setCreatingNew(false)
              setError('')
            }}
          />
        ) : planSummaries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
            <p className="mb-3">Nessuna scheda ancora. Crea la prima scheda per questo cliente.</p>
            {!atPlanLimit && (
              <button
                type="button"
                onClick={startNewPlan}
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Crea scheda
              </button>
            )}
          </div>
        ) : plan ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex-1">
                <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
                {plan.description && <p className="text-sm text-gray-500 mt-1">{plan.description}</p>}
                <p className="text-xs text-gray-400 mt-2">{plan.exercises.length} esercizi</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCreatingNew(false)
                  setEditing(true)
                }}
                className="ml-3 shrink-0 text-sm font-medium text-primary-600 hover:text-primary-700 self-start"
              >
                Modifica
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Seleziona una scheda.</p>
        )}
        {saving && <p className="text-sm text-gray-500">Salvataggio…</p>}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <History className="w-5 h-5" />
          Storico allenamenti del cliente
        </h2>
        <WorkoutHistory forUserId={clientId} embedded />
      </section>
    </div>
  )
}
