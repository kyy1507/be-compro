export interface Role {
  id?: number;
  name?: string;
  description?: string;
  guard_name?: string;
}

export interface RolePermission {
  id?: string;
  name?: string;
  guard?: string;
  all?: boolean;
  index?: boolean;
  detail?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface Pagination<T> {
  data: T[];
  total: number;
  per_page: number;
  current_page: number;
}
