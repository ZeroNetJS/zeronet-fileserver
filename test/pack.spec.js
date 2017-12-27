/* eslint-env mocha */

'use strict'

const pack = require('../src/pack')
const assert = require('assert')
const crypto = require('zeronet-crypto')

const map = {
  '\x01\x02\x03\x047\x00': '1.2.3.4:55',
  '\x7f\x00\x00\x01\xb0\x9d': '127.0.0.1:40368',
  '\x05\x01\xad\xf0\xd8\x0f': '5.1.173.240:4056'
}

const map2 = {
  '\xd9\xb5G\xaf\x8f\x87\x95B\x8b\x8c\xd6\x11': '3g2upl4pq6kufc4m.onion:4566',
  '\xbb\x0f\xdf\xa69\x8bm\xe46KP\x00': 'xmh57jrzrnw6insl.onion:80'
}

describe('pack ip4', () => {
  Object.keys(map).forEach(packed => {
    it('should unpack ' + crypto.PythonJSONDump(packed) + ' as ' + map[packed], () => assert.equal(pack.v4.unpack(packed).join(':'), map[packed]))
    it('should pack ' + map[packed] + ' as ' + crypto.PythonJSONDump(packed), () => assert.equal(pack.v4.pack(map[packed]), packed))
  })
})

describe('pack onion', () => {
  Object.keys(map2).forEach(packed => {
    it('should unpack ' + crypto.PythonJSONDump(packed) + ' as ' + map2[packed], () => assert.equal(pack.onion.unpack(packed).join(':'), map2[packed]))
    it('should pack ' + map2[packed] + ' as ' + crypto.PythonJSONDump(packed), () => assert.equal(pack.onion.pack(map2[packed]), packed))
  })
})
