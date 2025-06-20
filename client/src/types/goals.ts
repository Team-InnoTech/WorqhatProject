export interface goals {
  documentId?: string;
  topic: string;
  status: string;
  notes?: string[];
  resources?: string[];
  tags?: string[];
  studyMaterial?: string;
  hours_spent_perday?: Int16Array;
  foreign_key_column?: string;
}
