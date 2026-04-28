export interface LoginResponse{
    token: string;
    email: string;
    roles: string[];
    isSucceeded: boolean;
    error: string[] | null;
    
}