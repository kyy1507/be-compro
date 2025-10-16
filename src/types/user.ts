export interface User {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
  roles?: number | string | Role | Role[];
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}
