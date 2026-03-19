export interface AddBlogPost {
    title: string;
    content: string;
    shortDescription: string;
    featuredImageUrl: string;
    urlHandle: string;
    publishedDate: Date;
    author: string;
    isVisible: boolean;


}
export interface BlogPost {
    id: string;
    title: string;
    content: string;
    shortDescription: string;
    featuredImageUrl: string;
    urlHandle: string;
    publishedDate: Date;
    author: string;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;


}