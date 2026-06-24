import React from "react";
import { Link } from "react-router-dom";
import { Category } from "../../data/categories";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/equipment?category=${category.id}`}
      className="relative block aspect-[4/3] rounded-lg overflow-hidden group border border-brand-green/10 shadow hover:shadow-lg hover:border-brand-green/30 transition-all duration-300"
    >
      {/* Category Image */}
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Text Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <span className="w-12 h-1 bg-brand-sand block mb-3 group-hover:w-20 transition-all duration-300" />
        <h3 className="text-2xl font-heading text-white tracking-wide">
          {category.name}
        </h3>
        <p className="text-brand-beige/80 text-xs font-glonimove font-light mt-2 line-clamp-2 max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100 transition-all duration-500">
          {category.description}
        </p>
      </div>
    </Link>
  );
};
