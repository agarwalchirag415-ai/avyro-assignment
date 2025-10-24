import { Role } from './role.model';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role?: Role;
  roleId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

