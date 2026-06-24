const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const categoryKey = (category: string) => `category.${category}`;

export const categoryNameKey = (name: string) => `category.${slugify(name)}`;

export const blogCategoryKey = (name: string) => `blog.category.${slugify(name)}`;

export const specLabelKey = (label: string) => `spec.${slugify(label)}`;

export const productTaglineKey = (productId: string) => `product.${productId}.tagline`;

export const productDescriptionKey = (productId: string) => `product.${productId}.description`;

export const productFeatureKey = (productId: string, index: number) =>
  `product.${productId}.feature.${index}`;
