export interface UserCreateInput {
  email: string;
  password: string;
  username?: string;
  name?: string;
}

export interface UserUpdateInput {
  email?: string;
  password?: string;
  username?: string;
  name?: string;
}

export interface User {
  avatar?: string;
  collectionId?: string;
  collectionName?: string;
  created?: string;
  email: string;
  emailVisibility?: boolean;
  id?: string;
  name?: string;
  updated?: string;
  username?: string;
  verified?: boolean;
  website?: string;
  password?: string;
  passwordConfirm?: string;
}

export interface UserListResponse {
  items: User[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface Table
  extends Omit<
    User,
    'password' | 'passwordConfirm' | 'collectionId' | 'collectionName'
  > {}
