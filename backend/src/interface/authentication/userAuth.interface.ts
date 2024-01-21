export interface IUserAuthResponse {
  token: string;
  user: { id: string; email: string; name: string; image: string };
}
