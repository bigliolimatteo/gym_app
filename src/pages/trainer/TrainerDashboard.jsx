import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Plus, Dumbbell } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export default function TrainerDashboard() {
  const { user } = useAuth()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  const loadClients = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    const { data: links, error: qErr } = await supabase
      .from('trainer_clients')
      .select('id, client_id, created_at')
      .eq('trainer_id', user.id)
      .order('created_at', { ascending: false })

    if (qErr || !links?.length) {
      if (qErr) console.error(qErr)
      setClients([])
      setLoading(false)
      return
    }

    const ids = links.map((l) => l.client_id)
    const { data: profs } = await supabase.from('profiles').select('id, full_name, email').in('id', ids)

    const byId = Object.fromEntries((profs || []).map((p) => [p.id, p]))
    setClients(
      links.map((l) => ({
        id: l.id,
        created_at: l.created_at,
        client: byId[l.client_id] || { id: l.client_id, full_name: '', email: '' },
      })),
    )
    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  const handleAddClient = async (e) => {
    e.preventDefault()
    setError('')
    const trimmed = email.trim()
    if (!trimmed) return
    setAdding(true)
    const { error: rpcErr } = await supabase.rpc('add_client_by_email', { p_email: trimmed })
    if (rpcErr) {
      setError(rpcErr.message || 'Impossibile aggiungere il cliente')
    } else {
      setEmail('')
      await loadClients()
    }
    setAdding(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-8 h-8 text-primary-600" />
          I tuoi clienti
        </h1>
        <p className="text-gray-500 mt-1">Aggiungi un utente con la sua email e crea schede personalizzate.</p>
      </div>

      <form onSubmit={handleAddClient} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
        <label htmlFor="client-email" className="block text-sm font-medium text-gray-700">
          Email del cliente (deve avere già un account Utente)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="client-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="cliente@email.com"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={adding || !email.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            {adding ? 'Aggiunta…' : 'Aggiungi'}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {loading ? (
        <p className="text-gray-500">Caricamento…</p>
      ) : clients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-4">👥</p>
          <p className="text-gray-500 text-lg">Nessun cliente ancora</p>
          <p className="text-gray-400 text-sm mt-1">Aggiungi un utente con la sua email.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {clients.map((row) => {
            const c = row.client
            if (!c) return null
            return (
              <li key={row.id}>
                <Link
                  to={`/trainer/client/${c.id}`}
                  className="flex items-center justify-between bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{c.full_name || 'Utente'}</p>
                    <p className="text-sm text-gray-500">{c.email}</p>
                  </div>
                  <span className="text-primary-600 text-sm font-medium">Scheda →</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      <Link
        to="/esercizi"
        className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline"
      >
        <Dumbbell className="w-5 h-5" />
        Libreria esercizi
      </Link>
    </div>
  )
}
