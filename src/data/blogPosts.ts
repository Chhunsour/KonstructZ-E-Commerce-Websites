export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  image: string;
  detailImage: string;
  contentImages: string[];
  content: string;
  commentCount: number;
}

export const blogPosts: BlogPost[] = [];

export const blogCategories = [
  "Mini Excavator's Blog",
  "Skid Steer's Blog",
  "Wheel Loader's Blog",
  "Forklift's Blog",
  "Road Roller's Blog",
  "Scissor Lift's Blog",
  "Stone Crusher's Blog",
];

export const latestBlogPosts: BlogPost[] = [];

export const getBlogPostHref = (post: Pick<BlogPost, "slug">) => `/blog/${post.slug}`;

export const getBlogPostBySlug = (slug: string | undefined) =>
  blogPosts.find((post) => post.slug === slug);
