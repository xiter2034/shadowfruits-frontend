import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import './ProductModal.css'

export default function ProductModal({ listing, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('detail')
  const [pix, setPix] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

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
    <div className="moverlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mbox">
        <button className="mclose" onClick={onClose}>✕</button>

        {step === 'detail' && (
          <div className="mlayout">
            <div className="mleft">
              {listing.imagem_url
                ? <img src={listing.imagem_url} alt={listing.nome} className="mimg" />
                : <div className="mimg-empty">🎮</div>
              }
              {esgotada && <div className="mesgotado-overlay">Esgotado</div>}
            </div>

            <div className="mright">
              <h2 className="mtitle">{listing.nome}</h2>

              <div className="mbadges">
                <span className={esgotada ? 'mbadge mbadge-out' : 'mbadge mbadge-in'}>
                  {esgotada ? '❌ Esgotado' : `✅ ${listing.quantidade} em estoque`}
                </span>
                {!esgotada && <span className="mbadge mbadge-entrega">⚡ Entrega automática</span>}
              </div>

              <div className="mprice-row">
                <span className="mprice">R$ {Number(listing.preco).toFixed(2)}</span>
                <span className="mprice-sub">à vista no Pix</span>
              </div>

              {listing.descricao && (
                <div className="mdesc-block">
                  <p className="mdesc-label">DESCRIÇÃO</p>
                  <p className="mdesc">{listing.descricao}</p>
                </div>
              )}

              {listing.tags && listing.tags.length > 0 && (
                <div className="mtags">
                  {listing.tags.map(tag => (
                    <span key={tag} className="mtag">{tag}</span>
                  ))}
                </div>
              )}

              <div className="mgarantias">
                <div className="mgarantia">
                  <span>⚡</span>
                  <div>
                    <p className="mg-title">Entrega imediata</p>
                    <p className="mg-sub">Receba sua conta na hora, direto no site.</p>
                  </div>
                </div>
                <div className="mgarantia">
                  <span>🔒</span>
                  <div>
                    <p className="mg-title">Segurança total</p>
                    <p className="mg-sub">Seus dados são protegidos durante todo o processo.</p>
                  </div>
                </div>
                <div className="mgarantia">
                  <span>💳</span>
                  <div>
                    <p className="mg-title">Pagamento via Pix</p>
                    <p className="mg-sub">Aprovação instantânea, sem taxas extras.</p>
                  </div>
                </div>
              </div>

              {error && <p className="merror">{error}</p>}

              {esgotada ? (
                <div className="mesgotado-msg">
                  😔 Produto temporariamente esgotado. Volte em breve!
                </div>
              ) : (
                <button className="mbtn" onClick={handleBuy} disabled={loading}>
                  {loading ? <span className="spinner" /> : '🛒 Comprar agora'}
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'pix' && pix && (
          <div className="mpix">
            <div className="mpix-icon">💠</div>
            <h2 className="mtitle">Pague com Pix</h2>
            <p className="mpix-sub">Após o pagamento, a conta será enviada para sua caixa de entrada.</p>
            {pix.qr_base64 && (
              <img src={`data:image/png;base64,${pix.qr_base64}`} alt="QR Code" className="mpix-qr" />
            )}
            <div className="mpix-code">
              <input readOnly value={pix.pix_copia_cola} className="mpix-input" />
              <button className="mbtn" onClick={copyPix}>
                {copied ? '✅ Copiado!' : 'Copiar'}
              </button>
            </div>
            <p className="mpix-note">⚡ Entrega automática após confirmação.</p>
          </div>
        )}
      </div>
    </div>
  )
}