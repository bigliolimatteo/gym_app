import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, History } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import PlanEditor from '../../components/PlanEditor'
import { fetchLatestPlanForClient } from '../../lib/planUtils'
import WorkoutHistory from '../WorkoutHistory'

export default function ClientDetail() {
  const { clientId } = useParams()
  const { user } = useAuth()
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [allowed, setAllowed] = useState(false)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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
      const p = await fetchLatestPlanForClient(supabase, clientId, user.id)
      setPlan(p)
    } catch (e) {
      console.error(e)
      setPlan(null)
    }
    setLoading(false)
  }, [user?.id, clientId])

  useEffect(() => {
    load()
  }, [load])

  const savePlan = async ({ name, description, exercises }) => {
    if (!user?.id || !clientId) return
    setSaving(true)
    setError('')
    try {
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

      await load()
      setEditing(false)
    } catch (e) {
      setError(e.message || 'Salvataggio non riuscito')
    } finally {
      setSaving(false)
    }
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Scheda personalizzata</h2>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {plan ? 'Modifica' : 'Crea scheda'}
            </button>
          )}
        </div>

        {editing ? (
          <PlanEditor
            plan={plan}
            onSave={savePlan}
            onCancel={() => {
              setEditing(false)
              setError('')
            }}
          />
        ) : plan ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
            {plan.description && <p className="text-sm text-gray-500 mt-1">{plan.description}</p>}
            <p className="text-xs text-gray-400 mt-2">{plan.exercises.length} esercizi</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
            Nessuna scheda ancora. Crea la prima scheda per questo cliente.
          </div>
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
