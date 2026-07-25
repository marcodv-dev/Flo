import { useState, useCallback } from 'react'
import db from '../utils/db'

export function useEntries() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)

  const loadEntries = useCallback(async () => {
    setLoading(true)
    const items = await db.entries.orderBy('createdAt').reverse().toArray()
    setEntries(items)
    setLoading(false)
    return items
  }, [])

  const addEntry = useCallback(async (encryptedContent, iv) => {
    const now = Date.now()
    const id = `entry-${now}`
    const d = new Date(now)
    const months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']
    const formattedDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} - ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
    const entry = { id, createdAt: now, formattedDate, encryptedContent, iv, hasContent: true }
    await db.entries.add(entry)
    return entry
  }, [])

  const updateEntry = useCallback(async (id, encryptedContent, iv) => {
    await db.entries.update(id, { encryptedContent, iv })
  }, [])

  return { entries, loading, loadEntries, addEntry, updateEntry }
}
