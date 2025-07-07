import type { Access } from 'payload'

/**
 * @description Admin panel access control - allows access to admin interface
 * @dependencies None
 * @security Only authenticated users can access admin panel
 */
export const canAccessAdmin: Access = ({ req: { user } }) => {
  return Boolean(user)
}