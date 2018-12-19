# kv-file-cache

Key value cache store using a file for a value.

## Installation

```
$ npm install kv-file-cache
```

## Example

```js
const KvFileCache = require('kv-file-cache')

;(async () => {
  const cache = new KvFileCache('tmp/test')
  await cache.set('key', 'value')
  const has = await cache.has('key') // true
  const value = await cache.get('key') // 'value'
  await cache.clear('key')
  await cache.clearAll()
})()
```