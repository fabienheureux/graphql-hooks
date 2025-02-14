import fnv1a from '@sindresorhus/fnv1a'
import LRU from 'lru-cache'

function generateKey(keyObj) {
  return fnv1a(JSON.stringify(keyObj)).toString(36)
}

export default function memCache({ size = 100, ttl = 0, initialState } = {}) {
  const lru = new LRU({ maxSize: size, maxAge: ttl })

  if (initialState) {
    Object.keys(initialState).map(k => {
      lru.set(k, initialState[k])
    })
  }

  return {
    get: keyObj => lru.get(generateKey(keyObj)),
    set: (keyObj, data) => lru.set(generateKey(keyObj), data),
    delete: keyObj => lru.del(generateKey(keyObj)),
    clear: () => lru.reset(),
    keys: () => lru.keys(),
    getInitialState: () =>
      lru.keys().reduce(
        (initialState, key) => ({
          ...initialState,
          [key]: lru.get(key)
        }),
        {}
      )
  }
}
