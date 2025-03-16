export interface Solution {
  _id?: string;
  id?: number;
  title: string;
  difficulty: '简单' | '中等' | '困难';
  category: string;
  content: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
} 