export interface goals {
  documentId?: string;
  topic: string;
  status: string;
  notes?: string[];
  resources?: string[];
  tags?: string[];
  studyMaterial?: string;
  hours_spent_perday: number;
  foreign_key_column?: string;
}
