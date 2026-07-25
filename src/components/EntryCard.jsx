import { useEffect, useState } from 'react'
import { decryptData } from '../utils/crypto'
import { formatPreview, stripHtml } from '../utils/format'

export default function EntryCard({ entry, cryptoKey, onOpen }) {
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (!cryptoKey && entry.iv === '') {
      setPreview(formatPreview(stripHtml(entry.encryptedContent)))
      return
    }
    if (!cryptoKey || !entry.encryptedContent) return
    decryptData(cryptoKey, entry.iv, entry.encryptedContent)
      .then(text => setPreview(formatPreview(stripHtml(text))))
      .catch(() => setPreview('[impossibile decifrare]'))
  }, [entry, cryptoKey])

  return (
    <div className="entry-card" onClick={() => onOpen?.(entry)}>
      <div className="btn-glass entry-card-inner">
        <div className="entry-card-date">{entry.formattedDate}</div>
        <div className="entry-card-preview">
          {preview || <span className="entry-card-empty">contenuto cifrato</span>}
        </div>
      </div>
    </div>
  )
}
