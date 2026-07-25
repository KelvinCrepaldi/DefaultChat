export type UserSummary = {
  id: string;
  name: string;
  email: string;
  image: string;
};

/** User payload used in socket / session-adjacent chat messages */
export type ChatUser = {
  id?: string;
  name: string;
  email?: string;
  image: string;
  picture?: string;
};
