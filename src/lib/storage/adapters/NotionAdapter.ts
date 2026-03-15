import type { Book } from '@/src/types/book'
import type { StorageAdapter } from '../types'

// TODO: Implement Notion integration
// - Use Notion API to store books as database entries
// - Requires OAuth setup and database template
// - Map Book fields to Notion properties

export class NotionAdapter implements StorageAdapter {
  readonly adapterName = 'notion'

  async getAll(): Promise<Book[]> {
    throw new Error('Notion adapter not yet implemented')
  }

  async getById(_id: string): Promise<Book | null> {
    throw new Error('Notion adapter not yet implemented')
  }

  async save(_book: Book): Promise<void> {
    throw new Error('Notion adapter not yet implemented')
  }

  async update(_id: string, _patch: Partial<Book>): Promise<void> {
    throw new Error('Notion adapter not yet implemented')
  }

  async remove(_id: string): Promise<void> {
    throw new Error('Notion adapter not yet implemented')
  }

  async clear(): Promise<void> {
    throw new Error('Notion adapter not yet implemented')
  }

  async isAvailable(): Promise<boolean> {
    return false
  }
}
