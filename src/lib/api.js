// Todas as operações sensíveis (auth, compra, inbox) passam pelo backend Railway
// O frontend NUNCA acessa o Supabase diretamente para essas ações

const BASE = import.meta.env.VITE_API_URL

async function request(path, options = {}) {
  const token = localStorage.getItem('sf_token')
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro desconhecido')
  return data
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),

  // Checkout — gera o Pix via n8n
  checkout: (produto) => request('/checkout', { method: 'POST', body: JSON.stringify({ produto }) }),

  // Inbox — contas compradas pelo usuário
  inbox: () => request('/inbox'),
}
