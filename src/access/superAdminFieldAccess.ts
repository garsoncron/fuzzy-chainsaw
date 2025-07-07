import type { FieldAccess } from 'payload'

/**
 * @description Field-level access control for super admin sensitive data
 * @dependencies None
 * @security Only super admin users can access sensitive system fields
 */
export const superAdminFieldAccess: FieldAccess = ({ req: { user } }) => {
  return user?.role === 'superAdmin'
}