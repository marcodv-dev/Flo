export function arrayToHex(buf) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function hexToArray(hex) {
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return arr
}

export async function deriveKey(input, salt) {
  const keyData = typeof input === 'string' ? new TextEncoder().encode(input) : input
  const keyMaterial = await crypto.subtle.importKey('raw', keyData, 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptData(key, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(plaintext)
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  return { iv: arrayToHex(iv), data: arrayToHex(new Uint8Array(encrypted)) }
}

export async function decryptData(key, ivHex, dataHex) {
  const iv = hexToArray(ivHex)
  const data = hexToArray(dataHex)
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return new TextDecoder().decode(decrypted)
}