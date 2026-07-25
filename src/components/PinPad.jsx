import { useState, useCallback, useEffect } from 'react'

const MAX_LEN = 6

export default function PinPad({ onComplete, error, onBio }) {
  const [digits, setDigits] = useState([])

  useEffect(() => {
    if (digits.length === MAX_LEN) {
      const tid = setTimeout(() => {
        onComplete(digits.join(''))
        setDigits([])
      }, 120)
      return () => clearTimeout(tid)
    }
  }, [digits, onComplete])

  const press = useCallback((v) => {
    setDigits(prev => {
      if (prev.length >= MAX_LEN) return prev
      return [...prev, v]
    })
  }, [])

  const del = useCallback(() => setDigits(prev => prev.slice(0, -1)), [])

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20, width:'100%', maxWidth:280 }}>
      <div className="pin-dots">
        {Array.from({ length: MAX_LEN }).map((_, i) => (
          <div key={i} className={`pin-dot${i < digits.length ? ' filled' : ''}`} />
        ))}
      </div>
      <div className="pin-error">{error || ' '}</div>
      <div className="pin-grid">
        {keys.map((k, i) => {
          if (k === '' && onBio) return (
            <button key={i} className="btn-glass pin-key" onClick={onBio} type="button" title="Face ID / Impronta">
              <img src="/face-id.png" alt="" style={{width:35,height:35,display:'block',pointerEvents:'none',margin:'auto'}} />
            </button>
          )
          if (k === '') return <div key={i} className="pin-key pin-key-blank" />
          if (k === '⌫') return (
            <button key={i} className="btn-glass pin-key pin-key-action" onClick={del} type="button" style={{color:'#1F2937'}}>⌫</button>
          )
          return (
            <button key={i} className="btn-glass pin-key" onClick={() => press(Number(k))} type="button">{k}</button>
          )
        })}
      </div>
    </div>
  )
}