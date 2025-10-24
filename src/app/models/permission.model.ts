export type PermissionType = 'page' | 'feature';

export type PagePermission = 'dashboard' | 'users' | 'roles';

export type FeaturePermission = 'add-user' | 'edit-user' | 'delete-user' | 'add-role' | 'edit-role' | 'delete-role';

export interface Permission {
  id: string;
  name: string;
  type: PermissionType;
  code: PagePermission | FeaturePermission;
  description?: string;
}

