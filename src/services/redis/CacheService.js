const redis = require('redis');

/**
 * A class to manage cache server, Redis
 */
class CacheService {
  /**
   * A constructor function for the class
   */
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

  /**
   * A function to add cache to Redis Server
   * @param {string} key A key for redis to save the value into cache
   * @param {object/string} value the value to be cached
   * @param {integer} expirationInSecond How long do you want to save this
   * cache? (must be in second)
   */
  async set(key, value, expirationInSecond = 3600) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  /**
   * A function to retrieve cache from redis server
   * @param {string} key A key for redis to get the cache value
   * @return {object/string} the cache saved on redis server
   */
  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error('Catatan tidak ditemukan');

    return result;
  }

  /**
   * A function to delete the cache using a key
   * tidak memberikan async pada fungsi ini karena
   * kembalian dari@var this._client.del adalah @func Promise
   * keyword @await juga tidak digunakan perlu digunakan di sini
   * @param {string} key A key for redis to delete which is the cache
   * to be deleted
   * @return {Prommise} delete key function from redis package
   */
  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
