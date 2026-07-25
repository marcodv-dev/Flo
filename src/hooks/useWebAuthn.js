import { useState, useCallback } from 'react'

const RP_NAME = 'Flō'
const RP_ID = window.location.hostname
const CHALLENGE_KEY = 'flo-webauthn-id'

function isAvailable() {
  return typeof window.PublicKeyCredential !== 'undefined' &&
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
}

let _available = null

export function useWebAuthn() {
  const [supported, setSupported] = useState(null)
  const [credentialId, setCredentialId] = useState(() => localStorage.getItem(CHALLENGE_KEY))

  const check = useCallback(async () => {
    if (_available !== null) { setSupported(_available); return _available }
    if (!isAvailable()) { _available = false; setSupported(false); return false }
    const result = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    _available = result
    setSupported(result)
    return result
  }, [])

  const register = useCallback(async () => {
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const userId = crypto.getRandomValues(new Uint8Array(16))
    const credential = await navigator.credentials.create({
      publicKey: {
        rp: { name: RP_NAME, id: RP_ID },
        user: { id: userId, name: 'flo-user', displayName: 'Flō User' },
        challenge,
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        authenticatorSelection: { userVerification: 'required', requireResidentKey: false },
      }
    })
    const rawId = new Uint8Array(credential.rawId)
    const id = btoa(String.fromCharCode(...rawId))
    localStorage.setItem(CHALLENGE_KEY, id)
    setCredentialId(id)
    return rawId
  }, [])

  const authenticate = useCallback(async () => {
    const id = credentialId || localStorage.getItem(CHALLENGE_KEY)
    if (!id) return false
    const rawId = Uint8Array.from(atob(id), c => c.charCodeAt(0))
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    try {
      await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [{ id: rawId, type: 'public-key' }],
          userVerification: 'required'
        }
      })
      return true
    } catch {
      return false
    }
  }, [credentialId])

  const getRawId = useCallback(() => {
    const id = credentialId || localStorage.getItem(CHALLENGE_KEY)
    if (!id) return null
    return Uint8Array.from(atob(id), c => c.charCodeAt(0))
  }, [credentialId])

  const remove = useCallback(() => {
    localStorage.removeItem(CHALLENGE_KEY)
    setCredentialId(null)
  }, [])

  return { supported, check, register, authenticate, getRawId, remove, hasCredential: !!credentialId }
}
