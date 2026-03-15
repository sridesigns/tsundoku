import * as msgpack from '@msgpack/msgpack'
import * as lz4 from 'lz4js'
import type { Book } from '@/src/types/book'

export function encode(book: Book): Uint8Array {
  const packed = msgpack.encode(book)
  return lz4.compress(packed)
}

export function decode(data: Uint8Array): Book {
  const decompressed = lz4.decompress(data)
  return msgpack.decode(decompressed) as Book
}
