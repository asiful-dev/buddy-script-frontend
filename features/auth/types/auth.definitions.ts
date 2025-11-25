export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: {
      url: string;
      publicId: string;
    };
    createdAt: string;
    updatedAt: string;
  }

  export interface UpdateUserPayload {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    avatar?: File;
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
  