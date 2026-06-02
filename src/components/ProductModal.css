import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import './ProductModal.css'

export default function ProductModal({ listing, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep]       = useState('detail')
  const [pix, setPix]         = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [copied, setCopied]   = useState(false)

  const esgotada = listing.quantidade === 0

  async function handleBuy() {
    if (!user) { navigate('/login'); return }
    setLoading(true)
    setError('')
    try {
      const data = await api.checkout(listing.produto)
      setPix(data)
      setStep('pix')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function copyPix() {
    navigator.clipboard.writeText(pix.pix_copia_cola)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="modal-overlay fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-up" role="dialog" aria-modal="true">
        <button className="modal__close" onClick={onClose} aria-label="Fechar">✕</button>

        {step === 'detail' && (
          <div className="modal__layout">
            {/* Coluna esquerda — imagem */}
            <div className="modal__left">
              <div className="modal__img">
                {listing.imagem_url
                  ? <img src={listing.imagem_url} alt={listing.nome} />
                  : <div className="modal__img-empty">
                      <span style={{fontSize:52,opacity:0.3}}>🎮</span>
                    </div>
                }
                {esgotada && <div className="modal__img-esgotado">Esgotado</div>}
              </div>
            </div>

            {/* Coluna direita — info */}
            <div className="modal__right">
              <h2 className="modal__title">{listing.nome}</h2>

              {/* Estoque */}
              <div className="modal__meta">
                <span className={`modal__estoque-badge ${esgotada ? 'modal__estoque-badge--out' : ''}`}>
                  {esgotada ? '❌ Esgotado' : `✅ ${listing.quantidade} em estoque`}
                </span>
                {!esgotada && (
                  <span className="modal__entrega-badge">⚡ Entrega automática</span>
                )}
              </div>

              {/* Preço */}
              <div className="modal__price-block">
                <span className="modal__price">R$ {Number(listing.preco).toFixed(2)}</span>
                <span className="modal__price-sub">à vista no Pix</span>
              </div>

              {/* Descrição */}
              {listing.descricao && (
                <div className="modal__desc-block">
                  <h3 className="modal__desc-title">Descrição</h3>
                  <p className="modal__desc">{listing.descricao}</p>
                </div>
              )}

              {/* Tags */}
              {listing.tags?.length > 0 && (
                <div className="modal__tags">
                  {listing.tags.map(tag => (
                    <span key={tag} className="modal__tag">{tag}</span>
                  ))}
                </div>
              )}

              {/* Garantias */}
              <div className="modal__garantias">
                <div className="modal__garantia">
                  <span>⚡</span>
                  <div>
                    <p className="modal__garantia-title">Entrega imediata</p>
                    <p className="modal__garantia-sub">Receba sua conta na hora, direto no site.</p>
                  </div>
                </div>
                <div className="modal__garantia">
                  <span>🔒</span>
                  <div>
                    <p className="modal__garantia-title">Segurança total</p>
                    <p className="modal__garantia-sub">Seus dados são protegidos durante todo o processo.</p>
                  </div>
                </div>
                <div className="modal__garantia">
                  <span>💳</span>
                  <div>
                    <p className="modal__garantia-title">Pagamento via Pix</p>
                    <p className="modal__garantia-sub">Aprovação instantânea, sem taxas extras.</p>
                  </div>
                </div>
              </div>

              {error && <p className="modal__error">{error}</p>}

              {/* Botão */}
              {esgotada ? (
                <div className="modal__esgotado-msg">
                  😔 Este produto está temporariamente esgotado. Volte em breve!
                </div>
              ) : (
                <button
                  className="modal__cta"
                  onClick={handleBuy}
                  disabled={loading}
                >
                  {loading ? <span className="spinner" /> : '🛒 Comprar agora'}
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'pix' && pix && (
          <div className="modal__body modal__body--pix">
            <div className="pix__icon">💠</div>
            <h2 className="modal__title">Pague com Pix</h2>
            <p className="modal__level">Após o pagamento, a conta será enviada para sua caixa de entrada.</p>
            {pix.qr_base64 && (
              <img
                src={`data:image/png;base64,${pix.qr_base64}`}
                alt="QR Code Pix"
                className="pix__qr"
              />
            )}
            <div className="pix__code">
              <input readOnly value={pix.pix_copia_cola} className="pix__input" />
              <button className="btn btn-primary" onClick={copyPix}>
                {copied ? '✅ Copiado!' : 'Copiar código'}
              </button>
            </div>
            <p className="pix__note">⚡ A entrega é automática após confirmação do pagamento.</p>
          </div>
        )}
      </div>
    </div>
  )
}