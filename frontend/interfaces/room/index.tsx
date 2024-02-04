export interface IRoom {
  id: string;
  type: string;
  creator: string;
  name: string | null;
  admin: string | null;
  users?: any;
}
