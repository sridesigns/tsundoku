import type { Book } from '@/src/types/book'

export interface StorageAdapter {
  getAll(): Promise<Book[]>
  getById(id: string): Promise<Book | null>
  save(book: Book): Promise<void>
  update(id: string, patch: Partial<Book>): Promise<void>
  remove(id: string): Promise<void>
  clear(): Promise<void>
  isAvailable(): Promise<boolean>
  adapterName: string
}
