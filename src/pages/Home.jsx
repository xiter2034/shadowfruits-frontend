import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProductModal from '../components/ProductModal'
import './Home.css'

const CATEGORIAS = [
  { label: 'Todos',    filtro: 'TODOS' },
  { label: 'Destaques', filtro: 'DESTAQUE' },
  { label: 'V4',       filtro: 'V4' },
  { label: 'V3',       filtro: 'V3' },
  { label: 'Especiais', filtro: 'ESPECIAL' },
  { label: 'Básicas',  filtro: 'BASICA' },
]

const PRODUTO_META = {
  MAX:           { cor: '#7C3AED', categoria: 'BASICA' },
  GARP:          { cor: '#2563EB', categoria: 'BASICA' },
  POPULAR:       { cor: '#059669', categoria: 'BASICA' },
  BROOK:         { cor: '#D97706', categoria: 'BASICA' },
  RACA_V3_ALE:   { cor: '#6366F1', categoria: 'V3' },
  RACA_V3_HUMAN: { cor: '#6366F1', categoria: 'V3' },
  RACA_V3_MINK:  { cor: '#6366F1', categoria: 'V3' },
  RACA_V3_GHOUL: { cor: '#6366F1', categoria: 'V3' },
  RACA_V3_SHARK: { cor: '#6366F1', categoria: 'V3' },
  RACA_V3_ANGEL: { cor: '#6366F1', categoria: 'V3' },
  RACA_V4_ALE:   { cor: '#A855F7', categoria: 'V4' },
  RACA_V4_HUMAN: { cor: '#A855F7', categoria: 'V4' },
  RACA_V4_MINK:  { cor: '#A855F7', categoria: 'V4' },
  RACA_V4_GHOUL: { cor: '#A855F7', categoria: 'V4' },
  RACA_V4_SHARK: { cor: '#A855F7', categoria: 'V4' },
  RACA_V4_ANGEL: { cor: '#A855F7', categoria: 'V4' },
  SHARK_ANCHOR:  { cor: '#0EA5E9', categoria: 'ESPECIAL' },
  CDK:           { cor: '#F59E0B', categoria: 'ESPECIAL' },
}

export default function Home() {
  const [grupos, setGrupos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [categoria, setCategoria] = useState('TODOS')
  const [selected, setSelected]   = useState(null)

  useEffect(() => { fetchGrupos() }, [categoria])

  async function fetchGrupos() {
    setLoading(true)
    const { data } = await supabase
      .from('contas_site')
      .select('id, nome, produto, preco, status, imagem_url, descricao, tags, destaque')
      .in('status', ['DISPONIVEL','VENDIDA'])

    if (!data) { setGrupos([]); setLoading(false); return }

    // Agrupar por produto
    const mapa = {}
    for (const c of data) {
      if (!mapa[c.produto]) {
        mapa[c.produto] = {
          ...c,
          quantidade: 0,
          meta: PRODUTO_META[c.produto] || { cor: '#7C3AED', categoria: 'BASICA' },
        }
      }
      if (c.status === 'DISPONIVEL') mapa[c.produto].quantidade++
    }

    let lista = Object.values(mapa)

    // Filtrar por categoria
    if (categoria === 'DESTAQUE') lista = lista.filter(g => g.destaque)
    else if (categoria !== 'TODOS') lista = lista.filter(g => g.meta.categoria === categoria)

    // Ordenar: destaque primeiro, depois preço
    lista.sort((a, b) => {
      if (b.destaque !== a.destaque) return b.destaque ? 1 : -1
      return a.preco - b.preco
    })

    setGrupos(lista)
    setLoading(false)
  }

  const totalEstoque = grupos.reduce((acc, g) => acc + g.quantidade, 0)

  return (
    <main className="home">
      {/* Banner */}
      <div className="home__banner">
        <img src="/banner.png" alt="ShadowFruits" onError={e => e.target.style.display='none'} />
        <div className="home__banner-content">
          <h1 className="home__banner-title"><span></span></h1>
          <p className="home__banner-sub"></p>
        </div>
      </div>

      {/* Categorias */}
      <div className="home__filters">
        {CATEGORIAS.map(c => (
          <button
            key={c.filtro}
            className={`filter-tag ${categoria === c.filtro ? 'filter-tag--active' : ''}`}
            onClick={() => setCategoria(c.filtro)}
          >{c.label}</button>
        ))}
      </div>

      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">Contas disponíveis</h2>
          {!loading && <span className="home__section-count">{totalEstoque} em estoque</span>}
        </div>

        {loading ? (
          <div className="home__loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-skeleton" style={{ animationDelay: `${i*0.07}s` }} />
            ))}
          </div>
        ) : grupos.length === 0 ? (
          <div className="home__empty"><p>Nenhuma conta disponível nesta categoria.</p></div>
        ) : (
          <div className="home__grid">
            {grupos.map((g, i) => (
              <article
                key={g.produto}
                className={`card fade-up ${g.quantidade === 0 ? 'card--esgotado' : ''}`}
                style={{ animationDelay: `${i*0.06}s`, '--card-cor': g.meta.cor }}
                onClick={() => setSelected(g)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(g)}
                aria-label={`Ver detalhes: ${g.nome}`}
              >
                <div className="card__img">
                  {g.imagem_url
                    ? <img src={g.imagem_url} alt={g.nome} loading="lazy" />
                    : <div className="card__img-placeholder">
                        <span className="card__img-icon">🎮</span>
                      </div>
                  }
                  {g.destaque && g.quantidade > 0 && (
                    <span className="card__badge card__badge--destaque">Destaque</span>
                  )}
                  {g.quantidade === 0 ? (
                    <div className="card__esgotado-overlay">
                      <span className="card__esgotado-label">Esgotado</span>
                    </div>
                  ) : (
                    <span className="card__estoque">{g.quantidade} disponível{g.quantidade !== 1 ? 'is' : ''}</span>
                  )}
                </div>
                <div className="card__body">
                  <p className="card__name">{g.nome}</p>
                  <div className="card__footer">
                    <span className="card__price" style={g.quantidade === 0 ? {color:'var(--text-dim)'} : {}}>
                      R$ {Number(g.preco).toFixed(2)}
                    </span>
                    <span className="card__cta">{g.quantidade === 0 ? 'Em breve' : 'Ver →'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selected && <ProductModal listing={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}