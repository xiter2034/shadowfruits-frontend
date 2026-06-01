import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { supabase } from '../lib/supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

const registerSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  username: z.string().min(3, 'Mínimo 3 caracteres').max(32),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function makeToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// POST /auth/register
router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message })
  }

  const { email, password, username } = parsed.data

  // Verifica se e-mail já existe
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existing) return res.status(409).json({ error: 'E-mail já cadastrado' })

  // Gera hash com salt 10
  const salt = await bcrypt.genSalt(10)
  const senha_hash = await bcrypt.hash(password, salt)

  console.log('[register] email:', email, '| hash gerado:', senha_hash.substring(0, 20) + '...')

  const { data: user, error } = await supabase
    .from('users')
    .insert({ email, senha_hash, username, role: 'user' })
    .select('id, email, username, role')
    .single()

  if (error) {
    console.error('[register] erro supabase:', error)
    return res.status(500).json({ error: 'Erro ao criar conta: ' + error.message })
  }

  return res.status(201).json({ token: makeToken(user), user })
})

// POST /auth/login
router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Dados inválidos' })
  }

  const { email, password } = parsed.data

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, username, role, senha_hash')
    .eq('email', email)
    .maybeSingle()

  console.log('[login] email:', email, '| user encontrado:', !!user, '| erro:', error?.message)

  if (!user) return res.status(401).json({ error: 'E-mail ou senha incorretos' })

  console.log('[login] hash no banco:', user.senha_hash?.substring(0, 20) + '...')

  const valid = await bcrypt.compare(password, user.senha_hash)

  console.log('[login] senha válida:', valid)

  if (!valid) return res.status(401).json({ error: 'E-mail ou senha incorretos' })

  const { senha_hash, ...safeUser } = user
  return res.json({ token: makeToken(safeUser), user: safeUser })
})

// GET /auth/me
router.get('/me', authMiddleware, async (req, res) => {
  const { data: user } = await supabase
    .from('users')
    .select('id, email, username, role')
    .eq('id', req.user.id)
    .maybeSingle()

  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })
  return res.json({ user })
})

export default router