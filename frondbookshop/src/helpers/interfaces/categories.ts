export type SubCategoryDto = {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  displayName: string;
  description: string;
};

export type CategoryDto = {
  id: number;
  name: string;
  slug: string;
  displayName: string;
  description: string;
  subCategories: SubCategoryDto[];
};
