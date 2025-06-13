export interface goals {
  id?: Number; // optional for new entries
  topic: string;
  status: 'Beginner' | 'Intermediate' | 'Advanced';
  notes: string[];
  resources: string[];
  tags: string[];
  createdAt?: string;
}
