import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setSubmitting(true)
    try {
      const data = await signUp(email.trim(), password, fullName.trim(), role)
      if (data.session) {
        navigate(role === 'trainer' ? '/trainer' : '/', { replace: true })
      } else {
        setInfo('Controlla la tua email per confermare l’account, poi accedi.')
      }
    } catch (err) {
      setError(err.message || 'Registrazione non riuscita')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 mb-4">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Crea account</h1>
          <p className="text-gray-500 text-sm mt-1">Utente o personal trainer</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          {info && <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{info}</p>}

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">Tipo account</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-3 rounded-xl text-sm font-medium border-2 transition-colors ${
                  role === 'user' ? 'border-primary-500 bg-primary-50 text-primary-800' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Utente
              </button>
              <button
                type="button"
                onClick={() => setRole('trainer')}
                className={`py-3 rounded-xl text-sm font-medium border-2 transition-colors ${
                  role === 'trainer' ? 'border-primary-500 bg-primary-50 text-primary-800' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Personal trainer
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome e cognome
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password (min. 6 caratteri)
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Registrazione…' : 'Registrati'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Hai già un account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Accedi
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
