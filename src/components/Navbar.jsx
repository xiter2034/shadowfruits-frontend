import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Shadow<span>Fruits</span>
      </Link>

      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-user">Olá, {user.username}</span>
            <Link to="/dashboard" className="btn btn-ghost">Minhas Compras</Link>
            <button onClick={handleLogout} className="btn btn-ghost">Sair</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Entrar</Link>
            <Link to="/login?tab=register" className="btn btn-primary">Cadastrar</Link>
          </>
        )}
      </div>
    </nav>
  )
}
