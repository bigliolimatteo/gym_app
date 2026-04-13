/**
 * @param {string} isoDate value from workout_logs.date
 * @param {Date} [reference]
 */
export function isSameLocalCalendarDay(isoDate, reference = new Date()) {
  const d = new Date(isoDate)
  return (
    d.getFullYear() === reference.getFullYear() &&
    d.getMonth() === reference.getMonth() &&
    d.getDate() === reference.getDate()
  )
}

/**
 * Whether the user already has at least one workout log on the device's local calendar day.
 * Deleting a log removes it from the DB, so the user can train again the same day.
 * Uses recent rows and compares in local time so it works whether `date` is `date` or `timestamptz`.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @param {Date} [reference]
 */
export async function hasWorkoutLoggedToday(supabase, userId, reference = new Date()) {
  const { data, error } = await supabase
    .from('workout_logs')
    .select('id, date')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(40)

  if (error) throw error
  return (data || []).some((row) => isSameLocalCalendarDay(row.date, reference))
}
