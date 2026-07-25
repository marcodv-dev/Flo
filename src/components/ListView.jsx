import { useEffect } from 'react'
import ListHeader from './ListHeader'
import EntryCard from './EntryCard'

export default function ListView({ entries, loading, loadEntries, cryptoKey, onNavigateNew, onOpenEntry }) {
  useEffect(() => { loadEntries() }, [loadEntries])

  return (
    <div className="list-wrapper">
      <ListHeader onNew={onNavigateNew} />
      <div className="list-content">
        {loading && <div className="list-empty">Caricamento...</div>}
        {!loading && entries.length === 0 && (
          <div className="list-empty">
            Tocca + per iniziare.
          </div>
        )}
        {entries.map(e => (
          <EntryCard key={e.id} entry={e} cryptoKey={cryptoKey} onOpen={onOpenEntry} />
        ))}
      </div>
    </div>
  )
}
