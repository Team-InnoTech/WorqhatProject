export type Goal = {
  _id?: string;
  topic: string;
  status: 'Beginner' | 'Intermediate' | 'Advanced';
  notes: string[];
  resources: string[];
  tags?: string[];
};