import type { Access } from 'payload'

/**
 * @description Team management access control - allows team configuration and approval
 * @dependencies None
 * @security Only admins and super admins can manage teams
 */
export const canManageTeams: Access = ({ req: { user } }) => {
  return ['superAdmin', 'admin'].includes(user?.role)
}