import type { Access } from 'payload'

/**
 * @description Super admin access control - highest level privileges
 * @dependencies None
 * @security Only users with 'superAdmin' role can access
 */
export const isSuperAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'superAdmin'
}