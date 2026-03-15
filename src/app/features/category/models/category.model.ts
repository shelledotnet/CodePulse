export interface IAddCategoryRequest {
  name: string;
  urlHandle: string;
}
export interface IUpdateCategoryRequest {
  name: string;
  urlHandle: string;
}
export interface IGetAllCategoryResponse {
  id: string;
  name: string;
  urlHandle: string;
}