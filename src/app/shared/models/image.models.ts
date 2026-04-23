export interface UploadImageRequest {
    file: File;
    fileName: string;
    title: string;
    
}
export interface BlogImageResponseDto {
    Id: string;
    fileName: string;
    fileExtension: string;
    title: string;
    url: string;
    createdAt: string;
}
