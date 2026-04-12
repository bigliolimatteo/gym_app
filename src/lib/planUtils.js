/** @param {import('@supabase/supabase-js').SupabaseClient} supabase */
export async function fetchPlanWithExercises(supabase, planId) {
  const { data: plan, error: pErr } = await supabase.from('workout_plans').select('*').eq('id', planId).single()
  if (pErr) throw pErr
  const { data: rows, error: eErr } = await supabase
    .from('plan_exercises')
    .select('*')
    .eq('plan_id', planId)
    .order('position', { ascending: true })
  if (eErr) throw eErr
  return mapDbPlanToApp(plan, rows || [])
}

export function mapDbPlanToApp(planRow, exerciseRows) {
  return {
    id: planRow.id,
    name: planRow.name,
    description: planRow.description || '',
    createdAt: planRow.created_at,
    exercises: exerciseRows.map((r) => ({
      exerciseId: r.exercise_id,
      targetSets: r.target_sets ?? 3,
      targetReps: parseInt(String(r.target_reps ?? '10'), 10) || 10,
      restSeconds: r.rest_seconds ?? 90,
      notes: r.notes || '',
    })),
  }
}

/** @param {string} clientId @param {string} trainerId */
export async function fetchLatestPlanForClient(supabase, clientId, trainerId) {
  const { data, error } = await supabase
    .from('workout_plans')
    .select('id')
    .eq('client_id', clientId)
    .eq('trainer_id', trainerId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  if (!data?.id) return null
  return fetchPlanWithExercises(supabase, data.id)
}

/** User: assigned plan (latest for this user as client) */
export async function fetchUserAssignedPlan(supabase, userId) {
  const { data, error } = await supabase
    .from('workout_plans')
    .select('id')
    .eq('client_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  if (!data?.id) return null
  return fetchPlanWithExercises(supabase, data.id)
}
