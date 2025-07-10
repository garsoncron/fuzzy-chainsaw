import type { Access } from 'payload'

/**
 * @description Scorekeeper access control - scorekeeper, admin, and super admin privileges
 * @dependencies None
 * @security Only users with 'scorekeeper', 'admin', or 'superAdmin' role can access
 */
export const isScorekeeper: Access = ({ req: { user } }) => {
  return user?.role ? ['superAdmin', 'admin', 'scorekeeper'].includes(user.role) : false
}