import type { StorageAdapter } from './types'
import { IndexedDBAdapter } from './adapters/IndexedDBAdapter'
import { NotionAdapter } from './adapters/NotionAdapter'
import { GoogleDriveAdapter } from './adapters/GoogleDriveAdapter'

const ADAPTER_KEY = 'tsundoku_storage_adapter'

const adapters: Record<string, () => StorageAdapter> = {
  indexeddb: () => new IndexedDBAdapter(),
  notion: () => new NotionAdapter(),
  googledrive: () => new GoogleDriveAdapter(),
}

class StorageManagerClass {
  private adapter: StorageAdapter | null = null

  getAdapter(): StorageAdapter {
    if (this.adapter) return this.adapter

    let name = 'indexeddb'
    if (typeof window !== 'undefined') {
      name = localStorage.getItem(ADAPTER_KEY) || 'indexeddb'
    }

    const factory = adapters[name]
    if (!factory) {
      this.adapter = new IndexedDBAdapter()
    } else {
      this.adapter = factory()
    }

    return this.adapter
  }

  async switchAdapter(name: string, migrateData = false): Promise<void> {
    const newFactory = adapters[name]
    if (!newFactory) throw new Error(`Unknown adapter: ${name}`)

    const newAdapter = newFactory()
    const available = await newAdapter.isAvailable()
    if (!available) throw new Error(`Adapter ${name} is not available`)

    if (migrateData && this.adapter) {
      const books = await this.adapter.getAll()
      for (const book of books) {
        await newAdapter.save(book)
      }
    }

    this.adapter = newAdapter
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADAPTER_KEY, name)
    }
  }

  getAdapterName(): string {
    return this.getAdapter().adapterName
  }
}

export const StorageManager = new StorageManagerClass()
