export interface CategoryRequest {
  name: string;
  urlHandle: string;
}
export interface UpdateCategoryRequest {
  name: string;
  urlHandle: string;
}
export interface CategoryResponse {
  id: string;
  name: string;
  urlHandle: string;
  createdAt: Date;
  updatedAt: Date;
}