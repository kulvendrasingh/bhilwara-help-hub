
export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
};

export type Problem = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  solved: boolean;
  upvotes: number;
  downvotes: number;
  views: number;
};

export type Solution = {
  id: string;
  content: string;
  problemId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  accepted: boolean;
  upvotes: number;
  downvotes: number;
};

export type Comment = {
  id: string;
  content: string;
  parentType: 'problem' | 'solution';
  parentId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
};
