import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import './Home.css'

const FILTROS = ['Todos', 'Blox Fruits', 'Limitadas', 'Nível alto', 'Menor preço']

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('Todos')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchListings()
  }, [filtro])

  async function fetchListings() {
    setLoading(true)
    let query = supabase
      .from('contas')
      .select('id, nome, produto, nivel, preco, status, imagem_url, descricao, tags, destaque')
      .neq('status', 'PROCESSANDO')
      .order('destaque', { ascending: false })
      .order('created_at', { ascending: false })

    if (filtro === 'Blox Fruits') query = query.eq('produto', 'Blox Fruits')
    if (filtro === 'Nível alto') query = query.gte('nivel', 1500)
    if (filtro === 'Menor preço') query = query.order('preco', { ascending: true })
    if (filtro === 'Limitadas') query = query.eq('destaque', true)

    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }

  return (
    <main className="home">
      {/* Banner — troque o src pela URL da sua imagem */}
      <div className="home__banner">
        <div className="home__banner-inner">
          <img
            src="/banner.png"
            alt="ShadowFruits banner"
            onError={e => { e.target.style.display = 'none' }}
          />
          <div className="home__banner-fallback">
            <h1>Shadow<span>Fruits</span></h1>
            <p>Marketplace de contas Roblox · Entrega imediata</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="home__filters">
        {FILTROS.map(f => (
          <button
            key={f}
            className={`filter-tag ${filtro === f ? 'filter-tag--active' : ''}`}
            onClick={() => setFiltro(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">Contas disponíveis</h2>
          {!loading && (
            <span className="home__section-count">
              {listings.filter(l => l.status === 'DISPONIVEL').length} disponíveis
            </span>
          )}
        </div>

        {loading ? (
          <div className="home__loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-skeleton" style={{ animationDelay: `${i * 0.07}s` }} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="home__empty">
            <p>Nenhuma conta disponível no momento.</p>
          </div>
        ) : (
          <div className="home__grid">
            {listings.map((l, i) => (
              <ProductCard
                key={l.id}
                listing={l}
                onClick={setSelected}
                style={{ animationDelay: `${i * 0.06}s` }}
              />
            ))}
          </div>
        )}
      </section>

      {selected && (
        <ProductModal listing={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  )
}
