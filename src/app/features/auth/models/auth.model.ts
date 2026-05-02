export interface LoginResponse {
    // token: string;
    email: string;
    roles: string[];
    isSucceeded: boolean;
    error: string[] | null;

}
export interface LoadUser {
    email: string;
    roles: string[];

}