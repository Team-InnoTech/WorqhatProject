export interface goals {
  documentId?: string;
  topic: string;
  status: string;
  notes?: string[];
  resources?: string[];
  tags?: string[];
  foreign_key_column?: string;
}
