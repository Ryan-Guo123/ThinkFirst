export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface PromptExample {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'structure' | 'critique' | 'ideation';
}

export interface SectionData {
  id: string;
  title: string;
  content?: string;
}