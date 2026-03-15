export type BookStatus = 'to_read' | 'read' | 'removed'

export type CaptureMethod = 'photo' | 'typed' | 'voice'

export type Genre =
  | 'Fiction'
  | 'Literary Fiction'
  | 'Science Fiction'
  | 'Fantasy'
  | 'Mystery & Thriller'
  | 'Historical Fiction'
  | 'Non-Fiction'
  | 'Biography & Memoir'
  | 'Science & Nature'
  | 'Philosophy'
  | 'History'
  | 'Self-Development'
  | 'Design & Creativity'
  | 'Essays'
  | 'Graphic Novel'
  | 'Poetry'
  | 'Other'

export const GENRES: Genre[] = [
  'Fiction',
  'Literary Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery & Thriller',
  'Historical Fiction',
  'Non-Fiction',
  'Biography & Memoir',
  'Science & Nature',
  'Philosophy',
  'History',
  'Self-Development',
  'Design & Creativity',
  'Essays',
  'Graphic Novel',
  'Poetry',
  'Other',
]

export interface Book {
  id: string
  title: string
  author: string
  cover_url: string | null
  cover_cache?: string | null
  year: number | null
  description: string | null
  genre: Genre | null
  status: BookStatus
  capture_method: CaptureMethod
  date_added: number
  date_updated: number
  open_library_key: string | null
  notes: string | null
}

export interface SearchResult {
  open_library_key: string
  title: string
  author: string
  year: number | null
  cover_id: number | null
  description: string | null
}
