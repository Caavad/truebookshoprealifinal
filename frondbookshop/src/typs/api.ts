export interface BookDto {
  id?: number;
  title: string;
  author: string;
  price: number;
  description?: string;
  categoryId?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}
