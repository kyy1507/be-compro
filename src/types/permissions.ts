export interface Authorized {
  id: number;
  name: string;
  guard_name: string;
}

export interface ModulePermission {
  id?: number;
  module?: string;
  slug?: string;
  permissions?: any[];
}
