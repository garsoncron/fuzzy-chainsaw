import type { Access } from 'payload'

/**
 * @description Game claiming access control - allows claiming games for scoring
 * @dependencies None
 * @security Only scorekeepers, admins, and super admins can claim games
 */
export const canClaimGames: Access = ({ req: { user } }) => {
  return user?.role ? ['superAdmin', 'admin', 'scorekeeper'].includes(user.role) : false
}