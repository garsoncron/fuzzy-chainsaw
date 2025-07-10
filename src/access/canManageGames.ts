import type { Access } from 'payload'

/**
 * @description Game management access control - allows game scoring and management
 * @dependencies None
 * @security Only authenticated users with appropriate roles can manage games
 */
export const canManageGames: Access = ({ req: { user } }) => {
  return user?.role ? ['superAdmin', 'admin', 'scorekeeper'].includes(user.role) : false
}