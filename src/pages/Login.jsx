import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

export default function Login() {
  const [params] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') === 'register' ? 'register' : 'login')
  const [form, setForm] = useState({ email: '', password: '', username: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (user) navigate('/') }, [user])

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(form.email, form.password)
      } else {
        if (!form.username.trim()) throw new Error('Informe um nome de usuário')
        await register(form.email, form.password, form.username)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-card fade-up">
        <div className="login-logo">Shadow<span>Fruits</span></div>

        <div className="login-tabs">
          <button
            className={`login-tab ${tab === 'login' ? 'login-tab--active' : ''}`}
            onClick={() => setTab('login')}
          >Entrar</button>
          <button
            className={`login-tab ${tab === 'register' ? 'login-tab--active' : ''}`}
            onClick={() => setTab('register')}
          >Cadastrar</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {tab === 'register' && (
            <div className="field">
              <label className="field__label">Nome de usuário</label>
              <input
                className="field__input"
                type="text"
                placeholder="ShadowPlayer"
                value={form.username}
                onChange={set('username')}
                required
                autoComplete="username"
              />
            </div>
          )}
          <div className="field">
            <label className="field__label">E-mail</label>
            <input
              className="field__input"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label className="field__label">Senha</label>
            <input
              className="field__input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              required
              minLength={6}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="btn btn-primary login-submit" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : tab === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p className="login-back">
          <Link to="/">← Voltar ao marketplace</Link>
        </p>
      </div>
    </main>
  )
}
