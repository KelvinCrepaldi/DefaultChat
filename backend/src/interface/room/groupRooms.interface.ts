export interface ICreateGroupService {
  userId: string;
  name: string;
}

export interface ICreateGroupResponse {
  id: string;
  name: string;
  image: string | null;
  type: string;
  memberCount: number;
}

export interface ISearchGroupsService {
  userId: string;
  letters: string;
}

export interface ISearchGroupItem {
  id: string;
  name: string;
  image: string | null;
  memberCount: number;
}

export interface IJoinGroupService {
  userId: string;
  roomId: string;
}

export interface IGetGroupService {
  userId: string;
  roomId: string;
}

export interface IGroupRoomDetail {
  id: string;
  name: string;
  image: string | null;
  type: string;
  users: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  }[];
  messages: any[];
  notification: number;
}
