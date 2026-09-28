export interface IAddressResponse {
  status: string;
  message: string;
  data: IAddress[];
}

export interface IAddress {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}
export type userAddress = Omit<IAddress, '_id'>;

export interface IGetAddress {
  results: number;
  status: string;
  data: IAddress[];
}

export interface ISpecificAddress {
  status: string;
  data: IAddress;
}

export interface IChangePassword {
  message: string;
  user: User;
  token: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
}

export interface IEditProfile {
  message: string;
  user: User;
}
