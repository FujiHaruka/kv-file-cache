const KvFileCache = require('../lib')
const { strict: assert } = require('assert')
const uuid = require('uuid')

describe('KvFileCache', function () {
  it('Works', async () => {
    const cache = new KvFileCache('tmp/test')

    await cache.clearAll()

    const key = uuid()
    const value = uuid()

    assert.equal(await cache.get(key), null)

    await cache.set(key, value)

    assert.equal(await cache.has(key), true)
    assert.equal(await cache.get(key), value)

    await cache.clear(key)

    assert.equal(await cache.get(key), null)
  })

  it('Works hard', async () => {
    const cache = new KvFileCache('tmp/test2')

    await cache.clearAll()

    const keyValues = Array(100).fill(null).map(() => [uuid(), uuid()])

    await Promise.all(keyValues.map(([key, value]) => cache.set(key, value)))

    for (const [key, value] of keyValues) {
      assert.equal(await cache.get(key), value)
    }

    await cache.clearAll()
  })
})

/* global describe, it */
