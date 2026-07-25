import { useState, useEffect, useCallback } from 'react'
import PinPad from './PinPad'
import { useWebAuthn } from '../hooks/useWebAuthn'

export default function LockScreen({ onUnlock, hasSalt }) {
  const [pinError, setPinError] = useState('')
  const [confirmPin, setConfirmPin] = useState(null)
  const [mode, setMode] = useState('loading')
  const webAuthn = useWebAuthn()

  useEffect(() => {
    ;(async () => {
      const supported = await webAuthn.check()
      if (supported) {
        if (!webAuthn.hasCredential) {
          try {
            const rawId = await webAuthn.register()
            await onUnlock(rawId)
          } catch {
            setPinError('Registrazione biometrica fallita')
            setMode('pin')
          }
        } else {
          const ok = await webAuthn.authenticate()
          if (ok) {
            const rawId = webAuthn.getRawId()
            if (rawId) await onUnlock(rawId)
            else setPinError('Errore: credenziale non trovata')
          } else {
            setPinError('Autenticazione fallita')
            setMode('pin')
          }
        }
      } else if (hasSalt) {
        setMode('pin')
      } else {
        setMode('setup-pin')
      }
    })()
  }, [])

  const handlePin = useCallback(async (pin) => {
    setPinError('')
    if (confirmPin === null && !hasSalt) {
      setConfirmPin(pin)
      return
    }
    if (pin !== confirmPin && !hasSalt) {
      setPinError('PIN non corrispondente. Riprova.')
      setConfirmPin(null)
      return
    }
    try {
      await onUnlock(pin)
    } catch {
      setPinError('PIN errato')
    }
  }, [hasSalt, confirmPin, onUnlock])

  const retryBio = useCallback(async () => {
    setPinError('')
    const ok = await webAuthn.authenticate()
    if (ok) {
      const rawId = webAuthn.getRawId()
      if (rawId) await onUnlock(rawId)
    } else {
      setPinError('Autenticazione fallita')
    }
  }, [webAuthn, onUnlock])

  return (
    <div className="lock-screen">
      <div style={{ textAlign:'center' }}>
        <div className="lock-logo">Flō</div>
        <p className="lock-subtitle">
          {mode === 'loading' ? 'caricamento...' :
           mode === 'setup-pin' ? (confirmPin === null ? 'imposta il tuo PIN' : 'conferma il PIN') :
           'inserisci il PIN'}
        </p>
      </div>

      {(mode === 'pin' || mode === 'setup-pin') && (
        <PinPad onComplete={handlePin} error={pinError} onBio={retryBio} />
      )}
    </div>
  )
}
