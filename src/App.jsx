import { useState, useCallback, useEffect } from 'react'
import { useCrypto } from './hooks/useCrypto'
import { useAutoLock } from './hooks/useAutoLock'
import { useEntries } from './hooks/useEntries'
import LockScreen from './components/LockScreen'
import LockOverlay from './components/LockOverlay'
import EditorView from './components/EditorView'
import ListView from './components/ListView'

export default function App() {
  const { isLocked, unlock, lock, getKey, encrypt, decrypt, hasSalt } = useCrypto()
  const { entries, loading, loadEntries, addEntry, updateEntry } = useEntries()
  const [view, setView] = useState('list')
  const [editingEntry, setEditingEntry] = useState(null)

  useAutoLock(lock)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const onResize = () => document.documentElement.style.setProperty('--vh', `${vv.height}px`)
    vv.addEventListener('resize', onResize)
    onResize()
    return () => vv.removeEventListener('resize', onResize)
  }, [])

  const handleUnlock = useCallback(async (pinOrRawId) => {
    await unlock(pinOrRawId)
  }, [unlock])

  const handleSave = useCallback(async (html) => {
    const key = getKey()
    if (key) {
      const { iv, data } = await encrypt(html)
      if (editingEntry) {
        await updateEntry(editingEntry.id, data, iv)
      } else {
        await addEntry(data, iv)
      }
    } else {
      if (editingEntry) {
        await updateEntry(editingEntry.id, html, '')
      } else {
        await addEntry(html, '')
      }
    }
    setEditingEntry(null)
    await loadEntries()
    setView('list')
  }, [getKey, encrypt, editingEntry, addEntry, updateEntry, loadEntries])

  const handleOpenEntry = useCallback(async (entry) => {
    const key = getKey()
    let html = entry.encryptedContent
    if (key && entry.iv) {
      try {
        html = await decrypt(entry.iv, entry.encryptedContent)
      } catch {}
    }
    setEditingEntry({ ...entry, _text: html })
    setView('editor')
  }, [getKey, decrypt])

  const handleNavigateNew = useCallback(() => {
    setEditingEntry(null)
    setView('editor')
  }, [])

  if (isLocked) {
    return <LockScreen onUnlock={handleUnlock} hasSalt={hasSalt} />
  }

  return (
    <>
      <LockOverlay visible={false} />
      {view === 'editor' ? (
        <EditorView
          onSave={handleSave}
          onNavigateList={() => { setEditingEntry(null); setView('list') }}
          initialHtml={editingEntry ? editingEntry._text : undefined}
        />
      ) : (
        <ListView
          entries={entries}
          loading={loading}
          loadEntries={loadEntries}
          cryptoKey={getKey()}
          onNavigateNew={handleNavigateNew}
          onOpenEntry={handleOpenEntry}
        />
      )}
    </>
  )
}
