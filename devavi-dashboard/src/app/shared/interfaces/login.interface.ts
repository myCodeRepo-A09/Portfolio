export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: any; // Replace 'any' with your actual user type if available
}
