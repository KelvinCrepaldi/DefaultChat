export interface IUserAuthResponse {
  token: string;
  user: user;
}

interface user {
  id: string; 
  email: string; 
  name: string; 
  image: string
}
