import { createClient } from '@supabase/supabase-js'

// Apenas a anon key aqui — nunca a service_role
// A anon key só permite leitura de dados públicos (contas disponíveis)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
