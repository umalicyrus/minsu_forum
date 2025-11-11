// /types/answer.ts
export interface Answer {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  authorId: number;
  anonymous: boolean;
  author?: {
    id?: number;
    name?: string;
    image?: string | null;
  } | null;
}
