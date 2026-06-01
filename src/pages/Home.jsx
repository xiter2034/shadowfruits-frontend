import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProductModal from '../components/ProductModal'
import './Home.css'

const FILTROS = ['Todos', 'MAX', 'GARP', 'POPULAR', 'BROOK']

const PRODUTO_INFO = {
  MAX:     { label: 'Conta Max Level', cor: '#7C3AED' },
  GARP:    { label: 'Conta Garp',      cor: '#2563EB' },
  POPULAR: { label: 'Conta Popular',   cor: '#059669' },
  BROOK:   { label: 'Conta Brook',     cor: '#D97706' },
}

export default function Home() {
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('Todos')
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchGrupos() }, [filtro])

  async function fetchGrupos() {
    setLoading(true)

    let query = supabase
      .from('contas')
      .select('id, nome, produto, preco, status, imagem_url, descricao, tags, destaque')
      .eq('status', 'DISPONIVEL')

    if (filtro !== 'Todos') query = query.eq('produto', filtro)

    const { data } = await query
    if (!data) { setGrupos([]); setLoading(false); return }

    // Agrupar por produto
    const mapa = {}
    for (const conta of data) {
      const p = conta.produto
      if (!mapa[p]) {
        mapa[p] = {
          produto: p,
          nome: PRODUTO_INFO[p]?.label || p,
          cor: PRODUTO_INFO[p]?.cor || '#7C3AED',
          preco: conta.preco,
          descricao: conta.descricao,
          tags: conta.tags,
          imagem_url: conta.imagem_url,
          destaque: conta.destaque,
          quantidade: 0,
          // guarda um id representativo para o checkout
          id: conta.id,
        }
      }
      mapa[p].quantidade++
    }

    // Ordena: destaque primeiro, depois por preço
    const lista = Object.values(mapa).sort((a, b) => {
      if (b.destaque !== a.destaque) return b.destaque ? 1 : -1
      return a.preco - b.preco
    })

    setGrupos(lista)
    setLoading(false)
  }

  return (
    <main className="home">
      {/* Banner */}
      <div className="home__banner">
        <div className="home__banner-inner">
          <img src="/banner.png" alt="ShadowFruits" onError={e => { e.target.style.display = 'none' }} />
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
          >{f}</button>
        ))}
      </div>

      {/* Grid de grupos */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">Contas disponíveis</h2>
          {!loading && (
            <span className="home__section-count">
              {grupos.reduce((acc, g) => acc + g.quantidade, 0)} em estoque
            </span>
          )}
        </div>

        {loading ? (
          <div className="home__loading">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-skeleton" style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        ) : grupos.length === 0 ? (
          <div className="home__empty"><p>Nenhuma conta disponível no momento.</p></div>
        ) : (
          <div className="home__grid">
            {grupos.map((grupo, i) => (
              <article
                key={grupo.produto}
                className="card fade-up"
                style={{ animationDelay: `${i * 0.07}s`, '--card-cor': grupo.cor }}
                onClick={() => setSelected(grupo)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(grupo)}
              >
                <div className="card__img">
                  {grupo.imagem_url
                    ? <img src={grupo.imagem_url} alt={grupo.nome} loading="lazy" />
                    : <div className="card__img-placeholder">sem imagem</div>
                  }
                  {grupo.destaque && (
                    <span className="card__badge card__badge--destaque">Destaque</span>
                  )}
                  <span className="card__estoque">{grupo.quantidade} disponível{grupo.quantidade !== 1 ? 'is' : ''}</span>
                </div>
                <div className="card__body">
                  <p className="card__name">{grupo.nome}</p>
                  <p className="card__sub">{grupo.produto}</p>
                  <div className="card__footer">
                    <span className="card__price">R$ {Number(grupo.preco).toFixed(2)}</span>
                    <span className="card__cta">Ver detalhes →</span>
                  </div>
                </div>
              </article>
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
