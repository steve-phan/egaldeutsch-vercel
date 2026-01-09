export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  image: string;
}

export interface BlogPostDetail extends BlogPost {
  content: string;
}
