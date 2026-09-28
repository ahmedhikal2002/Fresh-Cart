export interface IUserPayload {
  id: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export interface IUserDate {
  name: string;
  email: string;
  token: string;
}
