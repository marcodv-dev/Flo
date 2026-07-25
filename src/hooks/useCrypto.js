import { useRef, useState, useCallback } from 'react'
import { deriveKey, encryptData, decryptData, arrayToHex, hexToArray } from '../utils/crypto'

const SALT_KEY = 'flo-salt'
const VERIFY_KEY = 'flo-verify'

function getStoredSalt() {
  const raw = localStorage.getItem(SALT_KEY)
  return raw ? hexToArray(raw) : null
}

function getStoredVerify() {
  const raw = localStorage.getItem(VERIFY_KEY)
  return raw ? JSON.parse(raw) : null
}

export function useCrypto() {
  const keyRef = useRef(null)
  const [isLocked, setIsLocked] = useState(true)
  const [salt, setSalt] = useState(getStoredSalt)

  const unlock = useCallback(async (pin) => {
    try {
      let s = salt
      if (!s) {
        s = crypto.getRandomValues(new Uint8Array(16))
        localStorage.setItem(SALT_KEY, arrayToHex(s))
        setSalt(s)
      }
      const key = await deriveKey(pin, s)

      const verify = getStoredVerify()

      if (!salt) {
        if (!verify) {
          try {
            const { iv, data } = await encryptData(key, 'ok')
            localStorage.setItem(VERIFY_KEY, JSON.stringify({ iv, data }))
          } catch (e) {
            console.error('verify token creation failed', e)
          }
        }
      } else if (verify) {
        await decryptData(key, verify.iv, verify.data)
      }

      keyRef.current = key
      setIsLocked(false)
    } catch (e) {
      console.error('unlock error:', e.name, e.message)
      throw new Error('PIN errato')
    }
  }, [salt])

  const lock = useCallback(() => {
    keyRef.current = null
    setIsLocked(true)
  }, [])

  const encrypt = useCallback(async (text) => {
    if (!keyRef.current) throw new Error('locked')
    return encryptData(keyRef.current, text)
  }, [])

  const getKey = useCallback(() => keyRef.current, [])

  const decrypt = useCallback(async (iv, data) => {
    if (!keyRef.current) throw new Error('locked')
    return decryptData(keyRef.current, iv, data)
  }, [])

  return { isLocked, unlock, lock, getKey, encrypt, decrypt, hasSalt: !!salt }
}