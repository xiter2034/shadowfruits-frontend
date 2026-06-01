import './ProductCard.css'

export default function ProductCard({ listing, onClick }) {
  const sold = listing.status === 'VENDIDA'

  return (
    <article
      className={`card ${sold ? 'card--sold' : ''}`}
      onClick={() => !sold && onClick(listing)}
      role="button"
      tabIndex={sold ? -1 : 0}
      onKeyDown={e => e.key === 'Enter' && !sold && onClick(listing)}
      aria-label={`Ver detalhes: ${listing.nome}`}
    >
      <div className="card__img">
        {listing.imagem_url
          ? <img src={listing.imagem_url} alt={listing.nome} loading="lazy" />
          : <div className="card__img-placeholder">sem imagem</div>
        }
        {listing.destaque && !sold && (
          <span className="card__badge card__badge--destaque">Destaque</span>
        )}
        {sold && (
          <span className="card__badge card__badge--sold">Vendida</span>
        )}
      </div>

      <div className="card__body">
        <p className="card__name">{listing.nome}</p>
        <p className="card__sub">{listing.nivel && `Nível ${listing.nivel} · `}{listing.produto}</p>
        <div className="card__footer">
          <span className="card__price">
            {sold ? <s>R$ {Number(listing.preco).toFixed(2)}</s> : `R$ ${Number(listing.preco).toFixed(2)}`}
          </span>
          {!sold && <span className="card__cta">Ver detalhes →</span>}
        </div>
      </div>
    </article>
  )
}