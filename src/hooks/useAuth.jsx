import { useState, useEffect, createContext, useContext } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sf_token')
    if (!token) { setLoading(false); return }
    api.me()
      .then(data => setUser(data.user))
      .catch(() => localStorage.removeItem('sf_token'))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const data = await api.login({ email, password })
    localStorage.setItem('sf_token', data.token)
    setUser(data.user)
    return data
  }

  async function register(email, password, username) {
    const data = await api.register({ email, password, username })
    localStorage.setItem('sf_token', data.token)
    setUser(data.user)
    return data
  }

  function logout() {
    localStorage.removeItem('sf_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
