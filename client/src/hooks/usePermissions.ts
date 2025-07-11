import { useMemo } from 'react';
import { useAuth } from './useAuth';

export type UserRole = 'user' | 'seller' | 'admin';

export interface Permission {
  resource: string;
  action: string;
}

// Define role-based permissions
const rolePermissions: Record<UserRole, Permission[]> = {
  user: [
    { resource: 'products', action: 'read' },
    { resource: 'cart', action: 'manage' },
    { resource: 'wishlist', action: 'manage' },
    { resource: 'orders', action: 'read' },
    { resource: 'reviews', action: 'create' },
    { resource: 'reviews', action: 'read' },
    { resource: 'chat', action: 'create' },
    { resource: 'profile', action: 'manage' },
  ],
  seller: [
    { resource: 'products', action: 'read' },
    { resource: 'products', action: 'create' },
    { resource: 'products', action: 'update' },
    { resource: 'products', action: 'delete' },
    { resource: 'inventory', action: 'manage' },
    { resource: 'orders', action: 'read' },
    { resource: 'orders', action: 'update' },
    { resource: 'reviews', action: 'read' },
    { resource: 'analytics', action: 'read' },
    { resource: 'chat', action: 'read' },
    { resource: 'profile', action: 'manage' },
  ],
  admin: [
    { resource: '*', action: '*' }, // Admin has all permissions
  ],
};

export function usePermissions() {
  const { user } = useAuth();

  const userPermissions = useMemo(() => {
    if (!user) return [];
    return rolePermissions[user.role as UserRole] || [];
  }, [user]);

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;

    // Admin has all permissions
    if (user.role === 'admin') return true;

    return userPermissions.some(
      (permission) =>
        (permission.resource === resource || permission.resource === '*') &&
        (permission.action === action || permission.action === '*')
    );
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => user?.role === role);
  };

  const canAccessResource = (resource: string): boolean => {
    return hasPermission(resource, 'read') || hasPermission(resource, 'manage');
  };

  const canManageResource = (resource: string): boolean => {
    return hasPermission(resource, 'manage') || hasPermission(resource, 'update');
  };

  const canCreateResource = (resource: string): boolean => {
    return hasPermission(resource, 'create') || hasPermission(resource, 'manage');
  };

  const canDeleteResource = (resource: string): boolean => {
    return hasPermission(resource, 'delete') || hasPermission(resource, 'manage');
  };

  // Resource-specific permission checks
  const canManageProducts = (): boolean => {
    return hasAnyRole(['seller', 'admin']);
  };

  const canAccessSellerDashboard = (): boolean => {
    return hasAnyRole(['seller', 'admin']);
  };

  const canAccessAdminPanel = (): boolean => {
    return hasRole('admin');
  };

  const canManageInventory = (): boolean => {
    return hasAnyRole(['seller', 'admin']);
  };

  const canViewAnalytics = (): boolean => {
    return hasAnyRole(['seller', 'admin']);
  };

  const canManageChat = (): boolean => {
    return hasRole('admin');
  };

  const canCreateReviews = (): boolean => {
    return hasAnyRole(['user', 'seller', 'admin']);
  };

  const canManageOrders = (): boolean => {
    return hasAnyRole(['seller', 'admin']);
  };

  return {
    user,
    userPermissions,
    hasPermission,
    hasRole,
    hasAnyRole,
    canAccessResource,
    canManageResource,
    canCreateResource,
    canDeleteResource,
    
    // Resource-specific permissions
    canManageProducts,
    canAccessSellerDashboard,
    canAccessAdminPanel,
    canManageInventory,
    canViewAnalytics,
    canManageChat,
    canCreateReviews,
    canManageOrders,
  };
}