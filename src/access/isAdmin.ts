import type { Access } from 'payload'

/**
 * @description Admin access control - admin and super admin privileges
 * @dependencies None
 * @security Only users with 'admin' or 'superAdmin' role can access
 */
export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'superAdmin' || user?.role === 'admin'
}