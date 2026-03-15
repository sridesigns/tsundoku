import { openDB, type IDBPDatabase } from 'idb'
import type { Book } from '@/src/types/book'
import type { StorageAdapter } from '../types'
import { encode, decode } from '../codec'

const DB_NAME = 'tsundoku'
const DB_VERSION = 1
const STORE_NAME = 'books'

export class IndexedDBAdapter implements StorageAdapter {
  readonly adapterName = 'indexeddb'
  private dbPromise: Promise<IDBPDatabase> | null = null

  private getDB(): Promise<IDBPDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME)
          }
        },
      })
    }
    return this.dbPromise
  }

  async getAll(): Promise<Book[]> {
    const db = await this.getDB()
    const keys = await db.getAllKeys(STORE_NAME)
    const books: Book[] = []
    for (const key of keys) {
      const raw = await db.get(STORE_NAME, key)
      if (raw instanceof Uint8Array) {
        books.push(decode(raw))
      }
    }
    return books
  }

  async getById(id: string): Promise<Book | null> {
    const db = await this.getDB()
    const raw = await db.get(STORE_NAME, id)
    if (raw instanceof Uint8Array) {
      return decode(raw)
    }
    return null
  }

  async save(book: Book): Promise<void> {
    const db = await this.getDB()
    const data = encode(book)
    await db.put(STORE_NAME, data, book.id)
  }

  async update(id: string, patch: Partial<Book>): Promise<void> {
    const existing = await this.getById(id)
    if (!existing) return
    const updated: Book = { ...existing, ...patch, date_updated: Date.now() }
    await this.save(updated)
  }

  async remove(id: string): Promise<void> {
    const db = await this.getDB()
    await db.delete(STORE_NAME, id)
  }

  async clear(): Promise<void> {
    const db = await this.getDB()
    await db.clear(STORE_NAME)
  }

  async isAvailable(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false
      await this.getDB()
      return true
    } catch {
      return false
    }
  }
}
