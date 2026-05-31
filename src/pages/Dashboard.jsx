import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../hooks/useAuth'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [inbox, setInbox] = useState([])
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState({})

  useEffect(() => {
    api.inbox()
      .then(data => setInbox(data.items || []))
      .finally(() => setLoading(false))
  }, [])

  function toggleReveal(id) {
    setRevealed(r => ({ ...r, [id]: !r[id] }))
  }

  function copyText(text) {
    navigator.clipboard.writeText(text)
  }

  return (
    <main className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Minhas Compras</h1>
        <p className="dashboard__sub">Olá, <strong>{user?.username}</strong> — aqui estão suas contas adquiridas.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : inbox.length === 0 ? (
        <div className="dashboard__empty">
          <p className="dashboard__empty-icon">📭</p>
          <p>Você ainda não realizou nenhuma compra.</p>
        </div>
      ) : (
        <div className="dashboard__list">
          {inbox.map(item => (
            <div key={item.id} className={`inbox-card fade-up ${!item.lido ? 'inbox-card--new' : ''}`}>
              <div className="inbox-card__header">
                <div>
                  <p className="inbox-card__produto">{item.produto}</p>
                  <p className="inbox-card__date">
                    {new Date(item.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                {!item.lido && <span className="inbox-card__new">Nova</span>}
              </div>

              <div className="inbox-card__credentials">
                <div className="cred-field">
                  <span className="cred-field__label">Usuário</span>
                  <div className="cred-field__row">
                    <span className="cred-field__value">
                      {revealed[item.id] ? item.usuario : '••••••••••'}
                    </span>
                    {revealed[item.id] && (
                      <button className="cred-copy" onClick={() => copyText(item.usuario)} title="Copiar">
                        📋
                      </button>
                    )}
                  </div>
                </div>
                <div className="cred-field">
                  <span className="cred-field__label">Senha</span>
                  <div className="cred-field__row">
                    <span className="cred-field__value">
                      {revealed[item.id] ? item.senha : '••••••••••'}
                    </span>
                    {revealed[item.id] && (
                      <button className="cred-copy" onClick={() => copyText(item.senha)} title="Copiar">
                        📋
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button
                className={`btn ${revealed[item.id] ? 'btn-ghost' : 'btn-primary'} inbox-card__reveal`}
                onClick={() => toggleReveal(item.id)}
              >
                {revealed[item.id] ? '🔒 Ocultar dados' : '🔓 Revelar dados da conta'}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
