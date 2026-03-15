import type { Book } from '@/src/types/book'
import type { StorageAdapter } from '../types'

// TODO: Implement Google Drive integration
// - Use Google Drive API to store books as JSON in AppData folder
// - Requires OAuth2 setup with drive.appdata scope
// - Store as single JSON file or individual files per book

export class GoogleDriveAdapter implements StorageAdapter {
  readonly adapterName = 'googledrive'

  async getAll(): Promise<Book[]> {
    throw new Error('Google Drive adapter not yet implemented')
  }

  async getById(_id: string): Promise<Book | null> {
    throw new Error('Google Drive adapter not yet implemented')
  }

  async save(_book: Book): Promise<void> {
    throw new Error('Google Drive adapter not yet implemented')
  }

  async update(_id: string, _patch: Partial<Book>): Promise<void> {
    throw new Error('Google Drive adapter not yet implemented')
  }

  async remove(_id: string): Promise<void> {
    throw new Error('Google Drive adapter not yet implemented')
  }

  async clear(): Promise<void> {
    throw new Error('Google Drive adapter not yet implemented')
  }

  async isAvailable(): Promise<boolean> {
    return false
  }
}
