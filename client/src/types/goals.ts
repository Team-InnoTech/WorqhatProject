export interface goals {
  documentId?: string
  topic: string
  status: 'Beginner' | 'Intermediate' | 'Advanced';
  notes: string[]
  resources: string[]
  tags: string[]
}
