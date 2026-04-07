import { openDB } from 'idb'

const DB_NAME = 'meditrack-sync-queue'
const STORE_NAME = 'pending-actions'

export async function queueAction(endpoint, method, body) {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { 
          keyPath: 'id', autoIncrement: true 
        })
      }
    }
  })
  
  await db.add(STORE_NAME, {
    endpoint,
    method,
    body,
    timestamp: new Date().toISOString()
  })
}

export async function replayQueuedActions(token) {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { 
          keyPath: 'id', autoIncrement: true 
        })
      }
    }
  })
  const actions = await db.getAll(STORE_NAME)
  
  for (const action of actions) {
    try {
      const response = await fetch(`http://localhost:8080${action.endpoint}`, {
        method: action.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(action.body)
      })
      if (response.ok) {
        await db.delete(STORE_NAME, action.id)
      } else {
        // If it's auth failure or 500, we might want to drop it, but keeping it for now
      }
    } catch (err) {
      break // stop if still offline
    }
  }
}
