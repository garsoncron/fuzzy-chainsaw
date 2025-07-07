import type { Access } from 'payload'

/**
 * @description Tournament management access control - full tournament operations
 * @dependencies None
 * @security Only admins and super admins can manage tournament settings
 */
export const canManageTournament: Access = ({ req: { user } }) => {
  return ['superAdmin', 'admin'].includes(user?.role)
}