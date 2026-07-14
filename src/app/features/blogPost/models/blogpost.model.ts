import { CategoryResponse } from "../../category/models/category.model";

export interface AddBlogPostRequestDto {
    title: string;
    content: string;
    shortDescription: string;
    featuredImageUrl: string;
    urlHandle: string;
    publishedDate: Date;
    author: string;
    isVisible: boolean;
    categories: string[];


}
export interface BlogPostResponseDto {
    id: string;
    title: string;
    content: string;
    shortDescription: string;
    featuredImageUrl: string;
    urlHandle: string;
    publishedDate: string;
    author: string;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
    categories: CategoryResponse[];

}
export interface UpdateBlogPostRequest {
    title: string;
    content: string;
    shortDescription: string;
    featuredImageUrl: string;
    urlHandle: string;
    publishedDate: Date;
    author: string;
    isVisible: boolean;
    categories: string[];

}