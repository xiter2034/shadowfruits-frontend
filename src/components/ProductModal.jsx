import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import './ProductModal.css'

export default function ProductModal({ listing, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('detail') // detail | pix | done
  const [pix, setPix] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
  }

  return (
    <div className="modal-overlay fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-up" role="dialog" aria-modal="true">
        <button className="modal__close" onClick={onClose} aria-label="Fechar">✕</button>

        {step === 'detail' && (
          <>
            <div className="modal__img">
              {listing.imagem_url
                ? <img src={listing.imagem_url} alt={listing.nome} />
                : <div className="modal__img-empty">sem imagem</div>
              }
            </div>
            <div className="modal__body">
              <h2 className="modal__title">{listing.nome}</h2>
              <p className="modal__level">
                {listing.nivel && `Nível ${listing.nivel} · `}{listing.produto}
              </p>
              {listing.tags?.length > 0 && (
                <div className="modal__tags">
                  {listing.tags.map(tag => (
                    <span key={tag} className="modal__tag">{tag}</span>
                  ))}
                </div>
              )}
              <p className="modal__desc">{listing.descricao}</p>
              {error && <p className="modal__error">{error}</p>}
              <div className="modal__footer">
                <div>
                  <p className="modal__price-label">preço</p>
                  <p className="modal__price">R$ {Number(listing.preco).toFixed(2)}</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleBuy}
                  disabled={loading}
                >
                  {loading ? <span className="spinner" /> : 'Comprar agora'}
                </button>
              </div>
            </div>
          </>
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
              <button className="btn btn-primary" onClick={copyPix}>Copiar código</button>
            </div>
            <p className="pix__note">
              ⚡ A entrega é automática após confirmação do pagamento.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
