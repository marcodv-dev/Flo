import Dexie from 'dexie'

const db = new Dexie('FloDiary')

db.version(1).stores({
  entries: 'id, createdAt'
})

export default db