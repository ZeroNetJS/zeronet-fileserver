'use strict'

const inet = require('inet-tools')
const assert = require('assert')

const base32Encode = require('base32-encode')
const b32encode = data => base32Encode(data, 'RFC3548')
const base32Decode = require('base32-decode')
const b32decode = data => base32Decode(data, 'RFC3548')

/*
# ip, port to packed 6byte format
def packAddress(ip, port):
    return socket.inet_aton(ip) + struct.pack("H", port)

# From 6byte format to ip, port
def unpackAddress(packed):
    assert len(packed) == 6, "Invalid length ip4 packed address: %s" % len(packed)
    return socket.inet_ntoa(packed[0:4]), struct.unpack_from("H", packed, 4)[0]

# onion, port to packed 12byte format
def packOnionAddress(onion, port):
    onion = onion.replace(".onion", "")
    return base64.b32decode(onion.upper()) + struct.pack("H", port)

# From 12byte format to ip, port
def unpackOnionAddress(packed):
return base64.b32encode(packed[0:-2]).lower() + ".onion", struct.unpack("H", packed[-2:])[0]

*/

const Port = {
  pack: port => {
    port = inet.pton(inet.ntoa(port)).substr(2, 2).split('')
    return port[1] + port[0] // reverse order (little endian)
  },
  unpack: port => {
    port = inet.ntop(port + port).split('.')
    return (parseInt(port[1]) * 256) + parseInt(port[0]) // reverse order (little endian)
  }
}

module.exports.v4 = module.exports.ip4 = {
  pack: (ip, port) => {
    if (port === undefined) {
      port = ip.split(':')[1]
      ip = ip.split(':')[0]
    }
    ip = inet.pton(ip)
    return ip + Port.pack(port)
  },
  unpack: pack => {
    assert.equal(pack.length, 6, 'Packed data has invalid length')
    let ip = pack.substr(0, 4)
    let port = pack.substr(-2)
    ip = inet.ntop(ip)
    return [ip, Port.unpack(port)]
  }
}

module.exports.onion = {
  pack: (addr, port) => {
    let b32
    if (port === undefined) {
      port = addr.split(':')[1]
      b32 = addr.split('.onion')[0]
    } else {
      b32 = addr.replace('.onion', '')
    }
    b32 = b32.toUpperCase()
    return Buffer.from(b32decode(b32)).toString('binary') + Port.pack(port) // yes, we are using b32 decode to pack
  },
  unpack: pack => {
    return [b32encode(Buffer.from(pack.slice(0, -2), 'binary')).toLowerCase() + '.onion', Port.unpack(pack.substr(-2))]
  }
}
