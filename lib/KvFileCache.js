const fs = require('fs')
const fsAsync = fs.promises
const { promisify } = require('util')
const { join, resolve } = require('path')
const mkdirpAsync = promisify(require('mkdirp'))

const pathExists = async (path) => {
  try {
    await fsAsync.access(path, fs.constants.R_OK)
    return true
  } catch (error) {
    return false
  }
}

class KvFileCache {
  constructor (cacheDir) {
    if (!cacheDir) {
      throw new Error(`cacheDir is required.`)
    }
    this.cacheDir = resolve(cacheDir)
  }

  async get (key, options = {}) {
    const { strict = false } = options
    try {
      const path = this._pathOf(key)
      const value = await fsAsync.readFile(path, { encoding: 'utf8' })
      return JSON.parse(value)
    } catch (e) {
      if (strict) {
        console.error(e)
        throw new Error(`[KV_FILE_CACHE] Not found value for key "${key}"`)
      }
      return null
    }
  }

  async set (key, value) {
    let strValue
    try {
      strValue = JSON.stringify(value)
    } catch (e) {
      throw new Error(`Not supported type of value ${String(value)}`)
    }
    const path = this._pathOf(key)
    await mkdirpAsync(this.cacheDir)
    await fsAsync.writeFile(path, strValue)
  }

  async has (key) {
    const path = this._pathOf(key)
    const exists = await pathExists(path)
    return exists
  }

  async clear (key) {
    if (await this.has(key)) {
      const path = this._pathOf(key)
      await fsAsync.unlink(path)
    }
  }

  async clearAll () {
    const keys = await this.keys()
    for (const key of keys) {
      await this.clear(key)
    }
  }

  async keys () {
    if (!(await pathExists(this.cacheDir))) {
      return []
    }
    const keys = await fsAsync.readdir(this.cacheDir)
    return keys
  }

  _pathOf (key) {
    return join(this.cacheDir, key)
  }
}

module.exports = KvFileCache
