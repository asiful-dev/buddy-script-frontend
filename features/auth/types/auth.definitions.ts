export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AuthSuccessResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  